import { getDb } from '../../_lib/mongo.js';
import { collections } from '../../_lib/collections.js';
import { methodNotAllowed, sendError, sendJson } from '../../_lib/http.js';
import { requireUser } from '../../_lib/user.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  // AUTH BYPASSED FOR TESTING
  const user = { _id: 'test-user' };

  const startRaw = String(req.query?.start ?? '');
  const endRaw = String(req.query?.end ?? '');
  if (!startRaw || !endRaw) return sendError(res, 400, 'VALIDATION_ERROR', 'Missing start/end query params');

  const start = new Date(startRaw);
  const end = new Date(endRaw);
  end.setHours(23, 59, 59, 999);

  const db = await getDb();
  const { transactions } = collections(db);

  const range = await transactions
    .find({ userId: user._id, occurredAt: { $gte: start, $lte: end } })
    .toArray();

  let income = 0;
  let expenses = 0;
  const spendingByCategory: Record<string, number> = {};

  for (const t of range) {
    if (t.type === 'income') income += t.amount;
    else {
      expenses += t.amount;
      spendingByCategory[t.category] = (spendingByCategory[t.category] ?? 0) + t.amount;
    }
  }

  const lifetimeAgg = await transactions
    .aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ])
    .toArray();

  const totalIncome = lifetimeAgg.find((x) => x._id === 'income')?.total ?? 0;
  const totalExpenses = lifetimeAgg.find((x) => x._id === 'expense')?.total ?? 0;
  const totalBalance = totalIncome - totalExpenses;

  const monthlyIncome = typeof user.monthlyIncome === 'number' ? user.monthlyIncome : 0;
  const remainingBudget = monthlyIncome - expenses;

  return sendJson(res, 200, {
    totalBalance,
    income,
    expenses,
    remainingBudget,
    spendingByCategory
  });
}
