import fs from 'fs';
import path from 'path';

export type TaxBracket = {
  from: number | null; // inclusive lower bound
  to: number | null; // inclusive upper bound or null for infinity
  rate: number; // decimal (0.1 = 10%)
};

export type TaxRule = {
  country: string;
  version: string;
  effectiveDate: string;
  currency?: string;
  brackets: TaxBracket[];
  allowances?: { [key: string]: number };
  deductions?: { [key: string]: { cap?: number } };
  notes?: string;
};

export type TaxInput = {
  grossAnnual: number;
  deductions?: { [key: string]: number };
  allowances?: { [key: string]: number };
};

export type TaxByBracket = {
  from: number | null;
  to: number | null;
  rate: number;
  taxable: number;
  tax: number;
};

export type TaxResult = {
  grossAnnual: number;
  taxableIncome: number;
  taxByBracket: TaxByBracket[];
  totalTaxAnnual: number;
  netAnnual: number;
  netMonthly: number;
  ruleVersion?: string;
};

export function computeTax(rule: TaxRule, input: TaxInput): TaxResult {
  const gross = Math.max(0, input.grossAnnual ?? 0);

  // Sum allowances from rule + input allowances
  let totalAllowances = 0;
  if (rule.allowances) {
    for (const k of Object.keys(rule.allowances)) totalAllowances += rule.allowances[k];
  }
  if (input.allowances) for (const k of Object.keys(input.allowances)) totalAllowances += input.allowances[k];

  // Sum deductions with caps
  let totalDeductions = 0;
  if (input.deductions) {
    for (const k of Object.keys(input.deductions)) {
      const val = Math.max(0, input.deductions[k] ?? 0);
      const cap = rule.deductions?.[k]?.cap ?? Infinity;
      totalDeductions += Math.min(val, cap);
    }
  }

  let taxable = gross - totalAllowances - totalDeductions;
  if (taxable < 0) taxable = 0;

  // Apply brackets
  const brackets = [...(rule.brackets ?? [])].sort((a, b) => (a.from ?? 0) - (b.from ?? 0));
  const byBracket: TaxByBracket[] = [];
  let totalTax = 0;

  for (const b of brackets) {
    const lower = b.from ?? 0;
    const upper = b.to ?? Infinity;
    const amount = Math.max(0, Math.min(taxable, upper) - lower);
    const tax = amount * b.rate;
    if (amount > 0) {
      byBracket.push({ from: lower, to: upper === Infinity ? null : upper, rate: b.rate, taxable: amount, tax });
      totalTax += tax;
    }
  }

  const netAnnual = gross - totalTax;
  return {
    grossAnnual: gross,
    taxableIncome: taxable,
    taxByBracket: byBracket,
    totalTaxAnnual: Math.round(totalTax * 100) / 100,
    netAnnual: Math.round(netAnnual * 100) / 100,
    netMonthly: Math.round((netAnnual / 12) * 100) / 100,
    ruleVersion: rule.version
  };
}

export function loadRuleForCountry(country: string): TaxRule | null {
  try {
    const file = path.resolve(process.cwd(), 'api', 'tax_rules', `${country.toLowerCase()}.json`);
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw) as TaxRule;
  } catch (err) {
    return null;
  }
}
