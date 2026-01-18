export type ApiUser = {
  id: string;
  email: string;
  name: string | null;
  currency: string | null;
  locale: string | null;
  monthlyIncome: number | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  user: ApiUser;
  accessToken: string;
  refreshToken: string;
};

export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
};

export type Budget = {
  id: string;
  name: string;
  totalBudget: number;
  period: 'monthly' | 'weekly';
  startDate: string;
  categories: Record<string, { budgeted: number; spent?: number }>;
  createdAt: string;
  updatedAt: string;
};

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  emoji: string | null;
  color: string | null;
  category: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AnalyticsSummary = {
  totalBalance: number;
  income: number;
  expenses: number;
  remainingBudget: number;
  spendingByCategory: Record<string, number>;
};
