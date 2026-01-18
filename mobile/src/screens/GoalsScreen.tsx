import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { Plus } from 'lucide-react-native';

import { createGoal, listGoals, type ApiGoal } from '../api/endpoints';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Card, InlineError, P, PrimaryButton, Screen, TextField, H1 } from '../components/Common/ui';
import { formatMoney, toIsoDate } from '../utils/format';
import { tokens } from '../theme/tokens';

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}

export function GoalsScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [items, setItems] = useState<ApiGoal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return toIsoDate(d);
  });
  const [isCreating, setIsCreating] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const goals = await listGoals();
      setItems(goals);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const parsedTarget = useMemo(() => {
    const n = Number(targetAmount.replace(/,/g, '.'));
    return Number.isFinite(n) ? n : NaN;
  }, [targetAmount]);

  const parsedCurrent = useMemo(() => {
    if (!currentAmount.trim()) return 0;
    const n = Number(currentAmount.replace(/,/g, '.'));
    return Number.isFinite(n) ? n : NaN;
  }, [currentAmount]);

  const canCreate = name.trim().length > 0 && Number.isFinite(parsedTarget) && parsedTarget > 0 && Number.isFinite(parsedCurrent) && !isCreating;

  const submitCreate = async () => {
    if (!canCreate) return;
    setError(null);
    setIsCreating(true);
    try {
      await createGoal({
        name: name.trim(),
        targetAmount: parsedTarget,
        currentAmount: parsedCurrent,
        targetDate
      });
      setName('');
      setTargetAmount('');
      setCurrentAmount('');
      setShowCreate(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create goal');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <H1 style={{ marginBottom: 0 }}>Goals</H1>
        <Pressable
          onPress={() => setShowCreate((v) => !v)}
          style={({ pressed }) => [
            {
              width: 44,
              height: 44,
              borderRadius: 18,
              backgroundColor: theme.colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.92 : 1
            }
          ]}
        >
          <Plus color={tokens.colors.white} size={20} />
        </Pressable>
      </View>

      <View style={{ marginTop: 14 }}>
        {error ? <InlineError message={error} /> : null}
        {isLoading || isCreating ? <ActivityIndicator color={theme.colors.primary} /> : null}
      </View>

      {showCreate ? (
        <View style={{ marginTop: 10 }}>
          <Card>
            <Text style={{ color: theme.colors.text, fontWeight: '900', fontSize: 16 }}>Create a goal</Text>
            <P style={{ marginTop: 6 }}>Set a target and track progress.</P>

            <View style={{ marginTop: 14 }}>
              <TextField label="Goal name" value={name} onChangeText={setName} placeholder="e.g. Emergency fund" />
              <TextField label="Target amount" value={targetAmount} onChangeText={setTargetAmount} placeholder="0" keyboardType="decimal-pad" />
              <TextField label="Current amount" value={currentAmount} onChangeText={setCurrentAmount} placeholder="0" keyboardType="decimal-pad" />
              <TextField label="Target date (YYYY-MM-DD)" value={targetDate} onChangeText={setTargetDate} placeholder="YYYY-MM-DD" />
              <PrimaryButton title="Create" onPress={submitCreate} disabled={!canCreate} />
            </View>
          </Card>
        </View>
      ) : null}

      <View style={{ marginTop: 12, flex: 1 }}>
        <FlatList
          data={items}
          keyExtractor={(g) => g.id}
          contentContainerStyle={items.length ? undefined : { flexGrow: 1, justifyContent: 'center' }}
          ListEmptyComponent={!isLoading ? <P style={{ textAlign: 'center' }}>No goals yet.</P> : null}
          renderItem={({ item }) => {
            const progress = item.targetAmount > 0 ? Math.min(1, Math.max(0, item.currentAmount / item.targetAmount)) : 0;
            return (
              <Card style={{ marginBottom: 10, paddingVertical: 12, paddingHorizontal: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: theme.colors.text, fontWeight: '900', fontSize: 16 }} numberOfLines={1}>
                    {item.emoji ? `${item.emoji} ` : ''}
                    {item.name}
                  </Text>
                  <Text style={{ color: theme.colors.textMuted, fontWeight: '800' }}>{Math.round(progress * 100)}%</Text>
                </View>

                <Text style={{ color: theme.colors.textMuted, marginTop: 6, fontWeight: '700' }}>
                  {formatMoney(item.currentAmount, user?.currency ?? '₦')} / {formatMoney(item.targetAmount, user?.currency ?? '₦')} • Target {formatDate(item.targetDate)}
                </Text>

                <View
                  style={{
                    height: 10,
                    backgroundColor: theme.colors.surfaceAlt,
                    borderRadius: 999,
                    overflow: 'hidden',
                    marginTop: 10
                  }}
                >
                  <View style={{ width: `${Math.round(progress * 100)}%`, height: '100%', backgroundColor: theme.colors.primary }} />
                </View>
              </Card>
            );
          }}
        />

        <View style={{ marginTop: 10 }}>
          <PrimaryButton title="Refresh" onPress={load} disabled={isLoading || isCreating} />
        </View>
      </View>
    </Screen>
  );
}
