import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { getAnalyticsSummary, type AnalyticsSummary } from '../api/endpoints';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Card, InlineError, P, PrimaryButton, Screen, H1 } from '../components/Common/ui';
import { categoryDotColor, formatMoney, toIsoDate } from '../utils/format';
import { tokens } from '../theme/tokens';

export function AnalyticsScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();

  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const range = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = now;
    return { start: toIsoDate(start), end: toIsoDate(end) };
  }, []);

  const load = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const summary = await getAnalyticsSummary(range.start, range.end);
      setData(summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  }, [range.end, range.start]);

  useEffect(() => {
    void load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const categories = useMemo(() => {
    const byCat = data?.spendingByCategory ?? {};
    return Object.entries(byCat)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [data]);

  const maxCat = useMemo(() => {
    return categories.reduce((m, c) => Math.max(m, c.amount), 0) || 1;
  }, [categories]);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <H1 style={{ marginBottom: 0 }}>Analytics</H1>
        <Pressable
          onPress={load}
          disabled={isLoading}
          style={({ pressed }) => [
            {
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: tokens.radius['2xl'],
              borderWidth: 1,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surface,
              opacity: isLoading ? 0.7 : pressed ? 0.92 : 1
            }
          ]}
        >
          <Text style={{ color: theme.colors.text, fontWeight: '900' }}>Refresh</Text>
        </Pressable>
      </View>

      <View style={{ marginTop: 14 }}>
        {error ? <InlineError message={error} /> : null}
        {isLoading ? <ActivityIndicator color={theme.colors.primary} /> : null}
      </View>

      <View style={{ marginTop: 10, flexDirection: 'row', gap: 10 }}>
        <Card style={{ flex: 1, paddingVertical: 12 }}>
          <Text style={{ color: theme.colors.textMuted, fontWeight: '800' }}>This Month</Text>
          <Text style={{ color: theme.colors.text, fontWeight: '900', fontSize: 18, marginTop: 6 }}>
            {formatMoney(data?.totalBalance ?? 0, user?.currency ?? '₦')}
          </Text>
          <P>Total balance</P>
        </Card>
        <Card style={{ flex: 1, paddingVertical: 12 }}>
          <Text style={{ color: theme.colors.textMuted, fontWeight: '800' }}>Remaining</Text>
          <Text style={{ color: theme.colors.text, fontWeight: '900', fontSize: 18, marginTop: 6 }}>
            {formatMoney(data?.remainingBudget ?? 0, user?.currency ?? '₦')}
          </Text>
          <P>Budget</P>
        </Card>
      </View>

      <View style={{ marginTop: 10, flexDirection: 'row', gap: 10 }}>
        <Card style={{ flex: 1, paddingVertical: 12 }}>
          <Text style={{ color: theme.colors.success, fontWeight: '800' }}>Income</Text>
          <Text style={{ color: theme.colors.text, fontWeight: '900', fontSize: 18, marginTop: 6 }}>
            {formatMoney(data?.income ?? 0, user?.currency ?? '₦')}
          </Text>
        </Card>
        <Card style={{ flex: 1, paddingVertical: 12 }}>
          <Text style={{ color: theme.colors.error, fontWeight: '800' }}>Expenses</Text>
          <Text style={{ color: theme.colors.text, fontWeight: '900', fontSize: 18, marginTop: 6 }}>
            {formatMoney(data?.expenses ?? 0, user?.currency ?? '₦')}
          </Text>
        </Card>
      </View>

      <View style={{ marginTop: 14 }}>
        <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: '900' }}>Spending by Category</Text>
        <P style={{ marginTop: 6 }}>Where your money went this month.</P>

        <View style={{ marginTop: 10, gap: 10 }}>
          {categories.length === 0 ? (
            <Card>
              <P>No category spending data yet.</P>
            </Card>
          ) : (
            categories.map(({ category, amount }) => {
              const pct = Math.max(0.04, Math.min(1, amount / maxCat));
              const dot = categoryDotColor(category);
              return (
                <Card key={category} style={{ paddingVertical: 12, paddingHorizontal: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 12 }}>
                      <View style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: dot, marginRight: 10 }} />
                      <Text style={{ color: theme.colors.text, fontWeight: '900' }} numberOfLines={1}>
                        {category}
                      </Text>
                    </View>
                    <Text style={{ color: theme.colors.text, fontWeight: '900' }}>{formatMoney(amount, user?.currency ?? '₦')}</Text>
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
                    <View
                      style={{
                        width: `${Math.round(pct * 100)}%`,
                        height: '100%',
                        backgroundColor: theme.colors.primary
                      }}
                    />
                  </View>
                </Card>
              );
            })
          )}
        </View>

        <View style={{ marginTop: 14 }}>
          <PrimaryButton title="Refresh" onPress={load} disabled={isLoading} />
        </View>
      </View>
    </Screen>
  );
}
