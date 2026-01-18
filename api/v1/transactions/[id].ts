import { z } from 'zod';
import { getDb } from '../../_lib/mongo.js';
import { collections } from '../../_lib/collections.js';
import { methodNotAllowed, readJson, sendError, sendJson, sendNoContent, type ApiRequest, type ApiResponse } from '../../_lib/http.js';
import { parseWith } from '../../_lib/validate.js';
import { requireUserId } from '../../_lib/user.js';

const PatchSchema = z
  .object({
    type: z.enum(['income', 'expense']).optional(),
    amount: z.number().finite().positive().optional(),
    category: z.string().min(1).max(60).optional(),
    description: z.string().min(1).max(120).optional(),
    occurredAt: z.string().datetime().optional()
  })
  .strict();

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET' && req.method !== 'PATCH' && req.method !== 'DELETE') {
    return methodNotAllowed(res, ['GET', 'PATCH', 'DELETE']);
  }

  // AUTH BYPASSED FOR TESTING
  const userId = 'test-user';

  const id = String(req.query?.id ?? '');
  if (!id) return sendError(res, 400, 'VALIDATION_ERROR', 'Missing id');

  const db = await getDb();
  const { transactions } = collections(db);

  if (req.method === 'GET') {
    const t = await transactions.findOne({ _id: id, userId });
    if (!t) return sendError(res, 404, 'NOT_FOUND', 'Transaction not found');
    return sendJson(res, 200, {
      transaction: {
        id: t._id,
        type: t.type,
        amount: t.amount,
        category: t.category,
        description: t.description,
        occurredAt: t.occurredAt.toISOString(),
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString()
      }
    });
  }

  if (req.method === 'DELETE') {
    const result = await transactions.deleteOne({ _id: id, userId });
    if (!result.deletedCount) return sendError(res, 404, 'NOT_FOUND', 'Transaction not found');
    return sendNoContent(res);
  }

  try {
    const body = await readJson<unknown>(req);
    const patch = parseWith(PatchSchema, body);
    const now = new Date();

    const update: any = { ...patch, updatedAt: now };
    if (patch.occurredAt) update.occurredAt = new Date(patch.occurredAt);

    const result = await transactions.updateOne({ _id: id, userId }, { $set: update });
    if (!result.matchedCount) return sendError(res, 404, 'NOT_FOUND', 'Transaction not found');

    const t = await transactions.findOne({ _id: id, userId });
    if (!t) return sendError(res, 404, 'NOT_FOUND', 'Transaction not found');
    return sendJson(res, 200, {
      transaction: {
        id: t._id,
        type: t.type,
        amount: t.amount,
        category: t.category,
        description: t.description,
        occurredAt: t.occurredAt.toISOString(),
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString()
      }
    });
  } catch (err: any) {
    if (err?.name === 'ZodError') {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Invalid request body', err.issues);
    }
    return sendError(res, 500, 'SERVER_ERROR', 'Unexpected error');
  }
}
