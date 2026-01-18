import crypto from 'crypto';
import { z } from 'zod';
import { getDb } from '../../_lib/mongo.js';
import { collections } from '../../_lib/collections.js';
import { methodNotAllowed, readJson, sendError, sendJson } from '../../_lib/http.js';
import { parseWith } from '../../_lib/validate.js';
import { requireUserId } from '../../_lib/user.js';

const CreateSchema = z.object({
  name: z.string().min(1).max(80),
  targetAmount: z.number().finite().positive(),
  currentAmount: z.number().finite().nonnegative().optional(),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  emoji: z.string().max(8).optional(),
  color: z.string().max(80).optional(),
  category: z.string().max(40).optional()
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET' && req.method !== 'POST') return methodNotAllowed(res, ['GET', 'POST']);

  // AUTH BYPASSED FOR TESTING
  const userId = 'test-user';

  const db = await getDb();
  const { goals } = collections(db);

  if (req.method === 'POST') {
    try {
      const body = await readJson<unknown>(req);
      const input = parseWith(CreateSchema, body);

      const now = new Date();
      const id = crypto.randomUUID();

      await goals.insertOne({
        _id: id,
        userId,
        name: input.name,
        targetAmount: input.targetAmount,
        currentAmount: input.currentAmount ?? 0,
        targetDate: input.targetDate,
        emoji: input.emoji ?? null,
        color: input.color ?? null,
        category: input.category ?? null,
        createdAt: now,
        updatedAt: now
      });

      const g = await goals.findOne({ _id: id, userId });
      return sendJson(res, 201, {
        goal: {
          id: g!._id,
          name: g!.name,
          targetAmount: g!.targetAmount,
          currentAmount: g!.currentAmount,
          targetDate: g!.targetDate,
          emoji: g!.emoji ?? null,
          color: g!.color ?? null,
          category: g!.category ?? null,
          createdAt: g!.createdAt.toISOString(),
          updatedAt: g!.updatedAt.toISOString()
        }
      });
    } catch (err: any) {
      if (err?.name === 'ZodError') {
        return sendError(res, 400, 'VALIDATION_ERROR', 'Invalid request body', err.issues);
      }
      return sendError(res, 500, 'SERVER_ERROR', 'Unexpected error');
    }
  }

  const items = await goals.find({ userId }).sort({ createdAt: -1, _id: -1 }).toArray();
  return sendJson(res, 200, {
    items: items.map((g) => ({
      id: g._id,
      name: g.name,
      targetAmount: g.targetAmount,
      currentAmount: g.currentAmount,
      targetDate: g.targetDate,
      emoji: g.emoji ?? null,
      color: g.color ?? null,
      category: g.category ?? null,
      createdAt: g.createdAt.toISOString(),
      updatedAt: g.updatedAt.toISOString()
    }))
  });
}
