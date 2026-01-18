import express from 'express';
import cors from 'cors';

import registerMod from '../api/v1/auth/register';
import loginMod from '../api/v1/auth/login';
import logoutMod from '../api/v1/auth/logout';
import refreshMod from '../api/v1/auth/refresh';
import authMeMod from '../api/v1/auth/me';
import usersMeMod from '../api/v1/users/me';

import taxCalcMod from '../api/v1/tax/calc';
import taxRulesMod from '../api/v1/tax/rules';

import budgetsIndexMod from '../api/v1/budgets/index';
import budgetsIdMod from '../api/v1/budgets/[id]';

import transactionsIndexMod from '../api/v1/transactions/index';
import transactionsIdMod from '../api/v1/transactions/[id]';

import goalsIndexMod from '../api/v1/goals/index';
import goalsIdMod from '../api/v1/goals/[id]';

import analyticsSummaryMod from '../api/v1/analytics/summary';

const app = express();
app.use(cors());
app.use(express.json());

function wrap(mod: any) {
  const handler = mod && (mod.default || mod);
  if (!handler) throw new Error('Invalid handler module');
  return (req: any, res: any) => Promise.resolve(handler(req, res)).catch((err) => {
    console.error('Handler error', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'SERVER_ERROR', details: String(err?.message ?? err) }));
  });
}

// Auth
app.all('/v1/auth/register', wrap(registerMod));
app.all('/v1/auth/login', wrap(loginMod));
app.all('/v1/auth/logout', wrap(logoutMod));
app.all('/v1/auth/refresh', wrap(refreshMod));
app.all('/v1/auth/me', wrap(authMeMod));

// Users
app.all('/v1/users/me', wrap(usersMeMod));

// Tax
app.all('/v1/tax/calc', wrap(taxCalcMod));
app.all('/v1/tax/rules', wrap(taxRulesMod));

// Budgets
app.all('/v1/budgets', wrap(budgetsIndexMod));
app.all('/v1/budgets/:id', wrap(budgetsIdMod));

// Transactions
app.all('/v1/transactions', wrap(transactionsIndexMod));
app.all('/v1/transactions/:id', wrap(transactionsIdMod));

// Goals
app.all('/v1/goals', wrap(goalsIndexMod));
app.all('/v1/goals/:id', wrap(goalsIdMod));

// Analytics
app.all('/v1/analytics/summary', wrap(analyticsSummaryMod));

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'NOT_FOUND' });
});

const PORT = Number(process.env.PORT || process.env.HTTP_PORT || 3002);
app.listen(PORT, () => console.log(`API container listening on port ${PORT}`));

export default app;
