import type { Collection, Db } from 'mongodb';

export type UserDoc = {
  _id: string;
  email: string;
  passwordHash: string;
  name?: string | null;
  currency?: string | null;
  locale?: string | null;
  monthlyIncome?: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SessionDoc = {
  _id: string;
  userId: string;
  refreshTokenHash: string;
  deviceName?: string | null;
  createdAt: Date;
  expiresAt: Date;
  revokedAt?: Date | null;
  rotatedAt?: Date | null;
};

export type TransactionDoc = {
  _id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  occurredAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type BudgetDoc = {
  _id: string;
  userId: string;
  name: string;
  totalBudget: number;
  period: 'monthly' | 'weekly';
  startDate: string; // YYYY-MM-DD
  categories: Record<string, { budgeted: number; spent?: number }>;
  createdAt: Date;
  updatedAt: Date;
};

export type GoalDoc = {
  _id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // YYYY-MM-DD
  emoji?: string | null;
  color?: string | null;
  category?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function collections(db: Db): {
  users: Collection<UserDoc>;
  sessions: Collection<SessionDoc>;
  transactions: Collection<TransactionDoc>;
  budgets: Collection<BudgetDoc>;
  goals: Collection<GoalDoc>;
} {
  return {
    users: db.collection<UserDoc>('users'),
    sessions: db.collection<SessionDoc>('sessions'),
    transactions: db.collection<TransactionDoc>('transactions'),
    budgets: db.collection<BudgetDoc>('budgets'),
    goals: db.collection<GoalDoc>('goals')
  };
}
