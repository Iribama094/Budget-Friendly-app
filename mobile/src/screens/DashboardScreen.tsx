import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Plus, ChevronRight } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getAnalyticsSummary, listTransactions, type AnalyticsSummary, type ApiTransaction } from '../api/endpoints';
import { Card, H1, InlineError, P, PrimaryButton, Screen } from '../components/Common/ui';
import { formatMoney, toIsoDate, toIsoDateTime } from '../utils/format';
import { tokens } from '../theme/tokens';

export function DashboardScreen() {
  const nav = useNavigation<any>();
  const { user, refreshUser } = useAuth();
  const { theme } = useTheme();
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [recent, setRecent] = useState<ApiTransaction[]>([]);
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
      const tx = await listTransactions({ start: toIsoDateTime(new Date(range.start)), end: toIsoDateTime(new Date(range.end)), limit: 3 });
      setData(summary);
      setRecent(tx.items || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setIsLoading(false);
    }
  }, [range.end, range.start]);

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const displayName = user?.name?.trim() || user?.email || 'there';
  const initials = (displayName || 'U').slice(0, 1).toUpperCase();

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <H1>
            {greeting}, {displayName}!
          </H1>
          <P style={{ marginTop: 6 }}>Ready to manage your budget?</P>
        </View>

        <Pressable
          onPress={() => nav.navigate('Profile')}
          style={({ pressed }) => [
            {
              width: 48,
              height: 48,
              borderRadius: 18,
              backgroundColor: theme.colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.92 : 1
            }
          ]}
        >
          <Text style={{ color: tokens.colors.white, fontWeight: '900', fontSize: 18 }}>{initials}</Text>
        </Pressable>
      </View>

      <View style={{ marginTop: 18 }}>
        {error ? <InlineError message={error} /> : null}
        {isLoading ? <ActivityIndicator color={theme.colors.primary} /> : null}
      </View>

      <View style={{ marginTop: 14 }}>
        <Card>
          <Text style={{ color: theme.colors.textMuted, fontWeight: '700' }}>This month</Text>
          <Text style={{ color: theme.colors.text, fontSize: 32, fontWeight: '900', marginTop: 8 }}>
            {formatMoney(data?.totalBalance ?? 0, user?.currency ?? '₦')}
          </Text>
          <P style={{ marginTop: 6 }}>Total balance</P>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.colors.textMuted, fontWeight: '700', fontSize: 12 }}>Income</Text>
              <Text style={{ color: theme.colors.text, fontWeight: '900', marginTop: 4 }}>
                {formatMoney(data?.income ?? 0, user?.currency ?? '₦')}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.colors.textMuted, fontWeight: '700', fontSize: 12 }}>Expenses</Text>
              <Text style={{ color: theme.colors.text, fontWeight: '900', marginTop: 4 }}>
                {formatMoney(data?.expenses ?? 0, user?.currency ?? '₦')}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 12 }}>
            <Text style={{ color: theme.colors.textMuted, fontWeight: '700', fontSize: 12 }}>Remaining budget</Text>
            <Text style={{ color: theme.colors.text, fontWeight: '900', marginTop: 4 }}>
              {formatMoney(data?.remainingBudget ?? 0, user?.currency ?? '₦')}
            </Text>
          </View>
        </Card>
      </View>

      <View style={{ marginTop: 14 }}>
        <Pressable
          onPress={() => nav.navigate('AddTransaction')}
          style={({ pressed }) => [
            {
              borderRadius: tokens.radius['2xl'],
              backgroundColor: theme.colors.primary,
              paddingVertical: 14,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 10,
              opacity: pressed ? 0.92 : 1
            }
          ]}
        >
          <Plus color={tokens.colors.white} size={18} />
          <Text style={{ color: tokens.colors.white, fontWeight: '900' }}>Add Transaction</Text>
        </Pressable>
      </View>

      <View style={{ marginTop: 18 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: '900' }}>Recent Activity</Text>
          <Pressable onPress={() => nav.navigate('Transactions')} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: theme.colors.primary, fontWeight: '800' }}>View All</Text>
            <ChevronRight color={theme.colors.primary} size={18} />
          </Pressable>
        </View>

        <View style={{ marginTop: 10, gap: 10 }}>
          {recent.length === 0 ? (
            <Card>
              <P>No transactions yet. Add your first transaction to get started!</P>
            </Card>
          ) : (
            recent.map((t) => (
              <Card key={t.id} style={{ paddingVertical: 12, paddingHorizontal: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1, paddingRight: 12 }}>
                    <Text style={{ color: theme.colors.text, fontWeight: '900' }} numberOfLines={1}>
                      {t.description || 'Transaction'}
                    </Text>
                    <Text style={{ color: theme.colors.textMuted, marginTop: 4 }} numberOfLines={1}>
                      {t.category}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontWeight: '900',
                      color: t.type === 'expense' ? theme.colors.error : theme.colors.success
                    }}
                  >
                    {t.type === 'expense' ? '-' : '+'}
                    {formatMoney(t.amount, user?.currency ?? '₦')}
                  </Text>
                </View>
              </Card>
            ))
          )}
        </View>
      </View>

      <View style={{ marginTop: 18, flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <PrimaryButton title="Refresh" onPress={load} disabled={isLoading} />
        </View>
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => void refreshUser()}
            style={({ pressed }) => [
              {
                borderRadius: tokens.radius['2xl'],
                paddingVertical: 14,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surface,
                opacity: pressed ? 0.92 : 1
              }
            ]}
          >
            <Text style={{ color: theme.colors.text, fontWeight: '900' }}>Refresh Profile</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
