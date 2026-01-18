import { apiFetch } from './client';
import { clearTokens, setTokens, type StoredTokens } from './storage';

export type ApiUser = {
  id: string;
  email: string;
  name?: string | null;
  currency?: string | null;
  locale?: string | null;
  monthlyIncome?: number | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = { user: ApiUser; accessToken: string; refreshToken: string };

export async function register(email: string, password: string, name?: string): Promise<AuthResponse> {
  const data = await apiFetch('/v1/auth/register', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({ email, password, name })
  });
  return data as AuthResponse;
}

export async function login(email: string, password: string, deviceName?: string): Promise<AuthResponse> {
  const data = await apiFetch('/v1/auth/login', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({ email, password, deviceName })
  });
  return data as AuthResponse;
}

export async function logout(refreshToken: string): Promise<void> {
  await apiFetch('/v1/auth/logout', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({ refreshToken })
  });
  clearTokens();
}

export function storeAuthTokens(tokens: StoredTokens) {
  setTokens(tokens);
}

export async function getMe(): Promise<ApiUser> {
  const data = await apiFetch('/v1/auth/me', { method: 'GET' });
  return (data as any).user as ApiUser;
}

export async function patchMe(patch: Partial<Pick<ApiUser, 'name' | 'currency' | 'locale' | 'monthlyIncome'>>): Promise<ApiUser> {
  const data = await apiFetch('/v1/users/me', { method: 'PATCH', body: JSON.stringify(patch) });
  return (data as any).user as ApiUser;
}

export type ApiTransaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
};

export async function listTransactions(params: {
  start?: string;
  end?: string;
  limit?: number;
  cursor?: string;
}): Promise<{ items: ApiTransaction[]; nextCursor: string | null }> {
  const qs = new URLSearchParams();
  if (params.start) qs.set('start', params.start);
  if (params.end) qs.set('end', params.end);
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.cursor) qs.set('cursor', params.cursor);
  const data = await apiFetch(`/v1/transactions?${qs.toString()}`, { method: 'GET' });
  return data as any;
}

export async function createTransaction(input: {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  occurredAt: string;
}): Promise<ApiTransaction> {
  const data = await apiFetch('/v1/transactions', { method: 'POST', body: JSON.stringify(input) });
  return (data as any).transaction as ApiTransaction;
}

export type ApiGoal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  emoji?: string | null;
  color?: string | null;
  category?: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function listGoals(): Promise<ApiGoal[]> {
  const data = await apiFetch('/v1/goals', { method: 'GET' });
  return (data as any).items as ApiGoal[];
}

export async function createGoal(input: {
  name: string;
  targetAmount: number;
  targetDate: string;
  currentAmount?: number;
  emoji?: string;
  color?: string;
  category?: string;
}): Promise<ApiGoal> {
  const data = await apiFetch('/v1/goals', { method: 'POST', body: JSON.stringify(input) });
  return (data as any).goal as ApiGoal;
}

export async function patchGoal(id: string, patch: Partial<ApiGoal>): Promise<ApiGoal> {
  const data = await apiFetch(`/v1/goals/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(patch) });
  return (data as any).goal as ApiGoal;
}

export async function deleteGoal(id: string): Promise<void> {
  await apiFetch(`/v1/goals/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export type ApiBudget = {
  id: string;
  name: string;
  totalBudget: number;
  period: 'monthly' | 'weekly';
  startDate: string;
  categories: Record<string, { budgeted: number; spent?: number }>;
  createdAt: string;
  updatedAt: string;
};

export async function listBudgets(params?: { start?: string; end?: string }): Promise<{ items: ApiBudget[] }> {
  const qs = new URLSearchParams();
  if (params?.start) qs.set('start', params.start);
  if (params?.end) qs.set('end', params.end);
  const suffix = qs.toString() ? `?${qs.toString()}` : '';
  const data = await apiFetch(`/v1/budgets${suffix}`, { method: 'GET' });
  return data as any;
}

export async function createBudget(input: {
  name: string;
  totalBudget: number;
  period: 'monthly' | 'weekly';
  startDate: string;
  categories: Record<string, { budgeted: number }>;
}): Promise<ApiBudget> {
  const data = await apiFetch('/v1/budgets', { method: 'POST', body: JSON.stringify(input) });
  return (data as any).budget as ApiBudget;
}

export type AnalyticsSummary = {
  totalBalance: number;
  income: number;
  expenses: number;
  remainingBudget: number;
  spendingByCategory: Record<string, number>;
};

export async function getAnalyticsSummary(start: string, end: string): Promise<AnalyticsSummary> {
  const qs = new URLSearchParams({ start, end });
  const data = await apiFetch(`/v1/analytics/summary?${qs.toString()}`, { method: 'GET' });
  return data as AnalyticsSummary;
}
