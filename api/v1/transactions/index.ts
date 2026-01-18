import crypto from 'crypto';
import { z } from 'zod';
import { getDb } from '../../_lib/mongo.js';
import { collections } from '../../_lib/collections.js';
import { methodNotAllowed, readJson, sendError, sendJson, type ApiRequest, type ApiResponse } from '../../_lib/http.js';
import { parseWith } from '../../_lib/validate.js';
import { requireUserId } from '../../_lib/user.js';

const CreateSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().finite().positive(),
  category: z.string().min(1).max(60),
  description: z.string().min(1).max(120),
  occurredAt: z.string().datetime()
});

function encodeCursor(doc: { occurredAt: Date; id: string }): string {
  return Buffer.from(JSON.stringify({ t: doc.occurredAt.toISOString(), id: doc.id })).toString('base64url');
}

function decodeCursor(raw: string): { t: Date; id: string } | null {
  try {
    const decoded = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'));
    if (!decoded?.t || !decoded?.id) return null;
    return { t: new Date(decoded.t), id: String(decoded.id) };
  } catch {
    return null;
  }
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') return methodNotAllowed(res, ['GET', 'POST']);

  // AUTH BYPASSED FOR TESTING
  const userId = 'test-user';

  const db = await getDb();
  const { transactions } = collections(db);

  if (req.method === 'POST') {
    try {
      const body = await readJson<unknown>(req);
      const input = parseWith(CreateSchema, body);

      const now = new Date();
      const id = crypto.randomUUID();
      const occurredAt = new Date(input.occurredAt);

      await transactions.insertOne({
        _id: id,
        userId,
        type: input.type,
        amount: input.amount,
        category: input.category,
        description: input.description,
        occurredAt,
        createdAt: now,
        updatedAt: now
      });

      return sendJson(res, 201, {
        transaction: {
          id,
          type: input.type,
          amount: input.amount,
          category: input.category,
          description: input.description,
          occurredAt: occurredAt.toISOString(),
          createdAt: now.toISOString(),
          updatedAt: now.toISOString()
        }
      });
    } catch (err: any) {
      if (err?.name === 'ZodError') {
        return sendError(res, 400, 'VALIDATION_ERROR', 'Invalid request body', err.issues);
      }
      return sendError(res, 500, 'SERVER_ERROR', 'Unexpected error');
    }
  }

  const { start, end, limit, cursor, type, category } = req.query ?? {};
  const parsedLimit = Math.max(1, Math.min(200, Number(limit ?? 50) || 50));

  const filter: any = { userId };
  if (type) filter.type = type;
  if (category) filter.category = category;

  if (start || end) {
    filter.occurredAt = {};
    if (start) filter.occurredAt.$gte = new Date(String(start));
    if (end) {
      const endDate = new Date(String(end));
      endDate.setHours(23, 59, 59, 999);
      filter.occurredAt.$lte = endDate;
    }
  }

  const decoded = cursor ? decodeCursor(String(cursor)) : null;
  if (decoded) {
    filter.$or = [
      { occurredAt: { ...(filter.occurredAt ?? {}), $lt: decoded.t } },
      { occurredAt: decoded.t, _id: { $lt: decoded.id } }
    ];
  }

  const items = await transactions
    .find(filter)
    .sort({ occurredAt: -1, _id: -1 })
    .limit(parsedLimit + 1)
    .toArray();

  const hasMore = items.length > parsedLimit;
  const page = hasMore ? items.slice(0, parsedLimit) : items;

  const nextCursor = hasMore
    ? encodeCursor({ occurredAt: page[page.length - 1].occurredAt, id: page[page.length - 1]._id })
    : null;

  return sendJson(res, 200, {
    items: page.map((t) => ({
      id: t._id,
      type: t.type,
      amount: t.amount,
      category: t.category,
      description: t.description,
      occurredAt: t.occurredAt.toISOString(),
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString()
    })),
    nextCursor
  });
}
