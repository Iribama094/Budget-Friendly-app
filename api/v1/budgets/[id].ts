import { z } from 'zod';
import { getDb } from '../../_lib/mongo.js';
import { collections } from '../../_lib/collections.js';
import { methodNotAllowed, readJson, sendError, sendJson, sendNoContent } from '../../_lib/http.js';
import { parseWith } from '../../_lib/validate.js';
import { requireUserId } from '../../_lib/user.js';

const CategoriesSchema = z.record(
  z.string().min(1).max(60),
  z.object({ budgeted: z.number().finite().nonnegative() }).passthrough()
);

const PatchSchema = z
  .object({
    name: z.string().min(1).max(80).optional(),
    totalBudget: z.number().finite().nonnegative().optional(),
    period: z.enum(['monthly', 'weekly']).optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    categories: CategoriesSchema.optional()
  })
  .strict();

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET' && req.method !== 'PATCH' && req.method !== 'DELETE') {
    return methodNotAllowed(res, ['GET', 'PATCH', 'DELETE']);
  }

  // AUTH BYPASSED FOR TESTING
  const userId = 'test-user';

  const id = String(req.query?.id ?? '');
  if (!id) return sendError(res, 400, 'VALIDATION_ERROR', 'Missing id');

  const db = await getDb();
  const { budgets } = collections(db);

  if (req.method === 'GET') {
    const b = await budgets.findOne({ _id: id, userId });
    if (!b) return sendError(res, 404, 'NOT_FOUND', 'Budget not found');
    return sendJson(res, 200, {
      budget: {
        id: b._id,
        name: b.name,
        totalBudget: b.totalBudget,
        period: b.period,
        startDate: b.startDate,
        categories: b.categories,
        createdAt: b.createdAt.toISOString(),
        updatedAt: b.updatedAt.toISOString()
      }
    });
  }

  if (req.method === 'DELETE') {
    const result = await budgets.deleteOne({ _id: id, userId });
    if (!result.deletedCount) return sendError(res, 404, 'NOT_FOUND', 'Budget not found');
    return sendNoContent(res);
  }

  try {
    const body = await readJson<unknown>(req);
    const patch = parseWith(PatchSchema, body);

    const now = new Date();
    const result = await budgets.updateOne({ _id: id, userId }, { $set: { ...patch, updatedAt: now } });
    if (!result.matchedCount) return sendError(res, 404, 'NOT_FOUND', 'Budget not found');

    const b = await budgets.findOne({ _id: id, userId });
    return sendJson(res, 200, {
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
