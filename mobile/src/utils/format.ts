import { tokens } from '../theme/tokens';

export function toIsoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function toIsoDateTime(d: Date) {
  return d.toISOString();
}

export function formatMoney(amount: number, currency?: string | null) {
  const c = currency && currency.length <= 5 ? currency : 'USD';

  // RN Intl support varies by engine; keep a safe fallback.
  try {
    // Some backends store currency as symbol (e.g. "₦") not ISO code.
    // If it's not an ISO code, fall back to symbol formatting.
    if (/^[A-Z]{3}$/.test(c)) {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: c,
        maximumFractionDigits: 2
      }).format(amount);
    }
  } catch {
    // ignore
  }

  // Symbol fallback: accept things like ₦, $, €
  const symbol = currency && currency.length <= 3 ? currency : '$';
  const n = Math.abs(amount);
  const formatted = n.toLocaleString?.() ?? String(n);
  return `${amount < 0 ? '-' : ''}${symbol}${formatted}`;
}

export function categoryDotColor(category: string): string {
  const c = category.trim().toLowerCase();
  if (c.includes('food') || c.includes('grocer') || c.includes('dining')) return tokens.colors.secondary[500];
  if (c.includes('transport') || c.includes('car') || c.includes('gas') || c.includes('taxi') || c.includes('uber')) return tokens.colors.primary[500];
  if (c.includes('shop')) return tokens.colors.accent[500];
  if (c.includes('bill') || c.includes('util') || c.includes('rent')) return tokens.colors.primary[700];
  return tokens.colors.gray[400];
}
