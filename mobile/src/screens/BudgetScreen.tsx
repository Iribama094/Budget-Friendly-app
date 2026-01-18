import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Slider from '@react-native-community/slider';

import { createBudget, listBudgets, type ApiBudget } from '../api/endpoints';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Card, InlineError, P, PrimaryButton, Screen, TextField, H1 } from '../components/Common/ui';
import { formatMoney, toIsoDate } from '../utils/format';
import { tokens } from '../theme/tokens';

type Alloc = { category: string; percent: number };

const DEFAULT_ALLOC: Alloc[] = [
  { category: 'Housing', percent: 30 },
  { category: 'Food', percent: 15 },
  { category: 'Transport', percent: 10 },
  { category: 'Utilities', percent: 10 },
  { category: 'Savings', percent: 20 },
  { category: 'Entertainment', percent: 5 },
  { category: 'Other', percent: 10 }
];

export function BudgetScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();

  const [budget, setBudget] = useState<ApiBudget | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [totalBudget, setTotalBudget] = useState('');
  const [period, setPeriod] = useState<'monthly' | 'weekly'>('monthly');
  const [alloc, setAlloc] = useState<Alloc[]>(DEFAULT_ALLOC);

  const range = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start: toIsoDate(start), end: toIsoDate(end) };
  }, []);

  const parsedTotal = useMemo(() => {
    const n = Number(totalBudget.replace(/,/g, '.'));
    return Number.isFinite(n) ? n : NaN;
  }, [totalBudget]);

  const allocatedPercent = useMemo(() => alloc.reduce((sum, a) => sum + a.percent, 0), [alloc]);
  const remainingPercent = 100 - allocatedPercent;

  const canSave = Number.isFinite(parsedTotal) && parsedTotal > 0 && allocatedPercent <= 100 && !isSaving;

  const load = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await listBudgets({ start: range.start, end: range.end });
      const current = res.items?.[0] ?? null;
      setBudget(current);
      if (current) {
        setTotalBudget(String(current.totalBudget));
        setPeriod(current.period);
      } else if (user?.monthlyIncome && !totalBudget) {
        setTotalBudget(String(user.monthlyIncome));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load budget');
    } finally {
      setIsLoading(false);
    }
  }, [range.end, range.start, totalBudget, user?.monthlyIncome]);

  useEffect(() => {
    void load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const save = async () => {
    if (!canSave) return;
    setError(null);
    setIsSaving(true);
    try {
      const categories: Record<string, { budgeted: number }> = {};
      for (const a of alloc) {
        if (a.percent <= 0) continue;
        categories[a.category] = { budgeted: Math.round((parsedTotal * a.percent) / 100) };
      }
      const input = {
        name: period === 'monthly' ? 'Monthly Budget' : 'Weekly Budget',
        totalBudget: parsedTotal,
        period,
        startDate: range.start,
        categories
      };
      const created = await createBudget(input);
      setBudget(created);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save budget');
    } finally {
      setIsSaving(false);
    }
  };

  const used = useMemo(() => {
    if (!budget) return 0;
    return Object.values(budget.categories || {}).reduce((sum, c) => sum + (c.spent ?? 0), 0);
  }, [budget]);

  const remaining = useMemo(() => {
    if (!budget) return 0;
    return Math.max(0, budget.totalBudget - used);
  }, [budget, used]);

  const progress = useMemo(() => {
    if (!budget || budget.totalBudget <= 0) return 0;
    return Math.min(1, Math.max(0, used / budget.totalBudget));
  }, [budget, used]);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <H1 style={{ marginBottom: 0 }}>Budget</H1>
        <Pressable
          onPress={load}
          disabled={isLoading || isSaving}
          style={({ pressed }) => [
            {
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: tokens.radius['2xl'],
              borderWidth: 1,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surface,
              opacity: isLoading || isSaving ? 0.7 : pressed ? 0.92 : 1,
              transform: [{ scale: pressed ? 0.985 : 1 }]
            }
          ]}
        >
          <Text style={{ color: theme.colors.text, fontWeight: '900' }}>Refresh</Text>
        </Pressable>
      </View>

      <View style={{ marginTop: 14 }}>
        {error ? <InlineError message={error} /> : null}
        {isLoading || isSaving ? <ActivityIndicator color={theme.colors.primary} /> : null}
      </View>

      {budget ? (
        <View style={{ marginTop: 10 }}>
          <Card>
            <Text style={{ color: theme.colors.textMuted, fontWeight: '800' }}>{budget.name}</Text>
            <Text style={{ color: theme.colors.text, fontWeight: '900', fontSize: 24, marginTop: 6 }}>
              {formatMoney(budget.totalBudget, user?.currency ?? '₦')}
            </Text>
            <P style={{ marginTop: 6 }}>Total budget</P>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.colors.textMuted, fontWeight: '700', fontSize: 12 }}>Spent</Text>
                <Text style={{ color: theme.colors.text, fontWeight: '900', marginTop: 4 }}>{formatMoney(used, user?.currency ?? '₦')}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.colors.textMuted, fontWeight: '700', fontSize: 12 }}>Remaining</Text>
                <Text style={{ color: theme.colors.text, fontWeight: '900', marginTop: 4 }}>{formatMoney(remaining, user?.currency ?? '₦')}</Text>
              </View>
            </View>

            <View
              style={{
                height: 10,
                backgroundColor: theme.colors.surfaceAlt,
                borderRadius: 999,
                overflow: 'hidden',
                marginTop: 12
              }}
            >
              <View style={{ width: `${Math.round(progress * 100)}%`, height: '100%', backgroundColor: theme.colors.primary }} />
            </View>
          </Card>

          <View style={{ marginTop: 12 }}>
            <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: '900' }}>Categories</Text>
            <View style={{ marginTop: 10, gap: 10 }}>
              {Object.entries(budget.categories || {}).map(([cat, c]) => {
                const spent = c.spent ?? 0;
                const pct = c.budgeted > 0 ? Math.min(1, Math.max(0, spent / c.budgeted)) : 0;
                return (
                  <Card key={cat} style={{ paddingVertical: 12, paddingHorizontal: 14 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ color: theme.colors.text, fontWeight: '900' }}>{cat}</Text>
                      <Text style={{ color: theme.colors.textMuted, fontWeight: '800' }}>{formatMoney(c.budgeted, user?.currency ?? '₦')}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                      <Text style={{ color: theme.colors.textMuted, fontWeight: '700' }}>Spent</Text>
                      <Text style={{ color: theme.colors.text, fontWeight: '800' }}>{formatMoney(spent, user?.currency ?? '₦')}</Text>
                    </View>
                    <View
                      style={{
                        height: 10,
                        backgroundColor: theme.colors.surfaceAlt,
                        borderRadius: 999,
                        overflow: 'hidden',
                        marginTop: 10
                      }}
                    >
                      <View style={{ width: `${Math.round(pct * 100)}%`, height: '100%', backgroundColor: theme.colors.primary }} />
                    </View>
                  </Card>
                );
              })}
            </View>
          </View>

          <View style={{ marginTop: 14 }}>
            <PrimaryButton title="Refresh" onPress={load} disabled={isLoading || isSaving} />
          </View>
        </View>
      ) : (
        <View style={{ marginTop: 10 }}>
          <Card>
            <H1 style={{ marginBottom: 6 }}>Set up your budget</H1>
            <P style={{ marginTop: 6 }}>Allocate your total budget across categories.</P>

            <View style={{ marginTop: 14 }}>
              <TextField label="Total Budget" value={totalBudget} onChangeText={setTotalBudget} placeholder="0" keyboardType="decimal-pad" />

              <Text style={{ color: theme.colors.text, fontWeight: '900', marginTop: 2 }}>Period</Text>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                {(['monthly', 'weekly'] as const).map((p) => {
                  const active = period === p;
                  return (
                    <Pressable
                      key={p}
                      onPress={() => setPeriod(p)}
                      style={({ pressed }) => [
                        {
                          flex: 1,
                          borderRadius: tokens.radius['2xl'],
                          paddingVertical: 12,
                          alignItems: 'center',
                          backgroundColor: active ? theme.colors.primary : theme.colors.surfaceAlt,
                          opacity: pressed ? 0.92 : 1
                        }
                      ]}
                    >
                      <Text style={{ color: active ? tokens.colors.white : theme.colors.text, fontWeight: '900' }}>
                        {p === 'monthly' ? 'Monthly' : 'Weekly'}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={{ marginTop: 14 }}>
                <Text style={{ color: theme.colors.text, fontWeight: '900' }}>Allocations</Text>
                <P style={{ marginTop: 6 }}>Allocated: {allocatedPercent}% • Remaining: {remainingPercent}%</P>

                {allocatedPercent > 100 ? (
                  <Text style={{ color: theme.colors.error, fontWeight: '800', marginTop: 6 }}>Total allocation cannot exceed 100%.</Text>
                ) : null}

                <View style={{ marginTop: 12, gap: 12 }}>
                  {alloc.map((a) => (
                    <View key={a.category} style={{ paddingVertical: 8 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: theme.colors.text, fontWeight: '900' }}>{a.category}</Text>
                        <Text style={{ color: theme.colors.textMuted, fontWeight: '800' }}>
                          {a.percent}% ({formatMoney((Number.isFinite(parsedTotal) ? parsedTotal : 0) * (a.percent / 100), user?.currency ?? '₦')})
                        </Text>
                      </View>
                      <Slider
                        value={a.percent}
                        minimumValue={0}
                        maximumValue={100}
                        step={1}
                        onValueChange={(v) => setAlloc((prev) => prev.map((x) => (x.category === a.category ? { ...x, percent: v } : x)))}
                        minimumTrackTintColor={theme.colors.primary}
                        maximumTrackTintColor={theme.colors.border}
                        thumbTintColor={theme.colors.primary}
                        style={{ marginTop: 8 }}
                      />
                    </View>
                  ))}
                </View>

                <View style={{ marginTop: 16 }}>
                  <PrimaryButton title="Save Budget" onPress={save} disabled={!canSave} />
                </View>
              </View>
            </View>
          </Card>
        </View>
      )}
    </Screen>
  );
}
