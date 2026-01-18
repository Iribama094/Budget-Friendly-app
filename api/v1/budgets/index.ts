import crypto from 'crypto';
import { z } from 'zod';
import { getDb } from '../../_lib/mongo.js';
import { collections } from '../../_lib/collections.js';
import { methodNotAllowed, readJson, sendError, sendJson } from '../../_lib/http.js';
import { parseWith } from '../../_lib/validate.js';
import { requireUserId } from '../../_lib/user.js';

const CategoriesSchema = z.record(
  z.string().min(1).max(60),
  z.object({ budgeted: z.number().finite().nonnegative() }).passthrough()
);

const CreateSchema = z.object({
  name: z.string().min(1).max(80),
  totalBudget: z.number().finite().nonnegative(),
  period: z.enum(['monthly', 'weekly']),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  categories: CategoriesSchema
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET' && req.method !== 'POST') return methodNotAllowed(res, ['GET', 'POST']);

  // AUTH BYPASSED FOR TESTING
  const userId = 'test-user';

  const db = await getDb();
  const { budgets } = collections(db);

  if (req.method === 'POST') {
    try {
      const body = await readJson<unknown>(req);
      const input = parseWith(CreateSchema, body);

      const now = new Date();
      const id = crypto.randomUUID();

      await budgets.insertOne({
        _id: id,
        userId,
        name: input.name,
        totalBudget: input.totalBudget,
        period: input.period,
        startDate: input.startDate,
        categories: input.categories,
        createdAt: now,
        updatedAt: now
      });

      const b = await budgets.findOne({ _id: id, userId });
      return sendJson(res, 201, {
        budget: {
          id: b!._id,
          name: b!.name,
          totalBudget: b!.totalBudget,
          period: b!.period,
          startDate: b!.startDate,
          categories: b!.categories,
          createdAt: b!.createdAt.toISOString(),
          updatedAt: b!.updatedAt.toISOString()
        }
      });
    } catch (err: any) {
      if (err?.name === 'ZodError') {
        return sendError(res, 400, 'VALIDATION_ERROR', 'Invalid request body', err.issues);
      }
      return sendError(res, 500, 'SERVER_ERROR', 'Unexpected error');
    }
  }

  const { start, end } = req.query ?? {};
  const filter: any = { userId };
  if (start || end) {
    // startDate is YYYY-MM-DD; treat as lexicographically comparable
    filter.startDate = {};
    if (start) filter.startDate.$gte = String(start);
    if (end) filter.startDate.$lte = String(end);
  }

  const items = await budgets.find(filter).sort({ startDate: -1, _id: -1 }).toArray();

  return sendJson(res, 200, {
    items: items.map((b) => ({
      id: b._id,
      name: b.name,
      totalBudget: b.totalBudget,
      period: b.period,
      startDate: b.startDate,
      categories: b.categories,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString()
    }))
  });
}
