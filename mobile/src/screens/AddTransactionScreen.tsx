import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';

import { createTransaction } from '../api/endpoints';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Card, InlineError, PrimaryButton, Screen, SecondaryButton, TextField, H1 } from '../components/Common/ui';
import { tokens } from '../theme/tokens';
import { toIsoDate, toIsoDateTime } from '../utils/format';

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Housing', 'Bills', 'Shopping', 'Health', 'Entertainment', 'Other'] as const;
const INCOME_CATEGORIES = ['Salary', 'Bonus', 'Gift', 'Interest', 'Other'] as const;

export function AddTransactionScreen() {
  const nav = useNavigation<any>();
  const { user } = useAuth();
  const { theme } = useTheme();

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => toIsoDate(new Date()));

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = useMemo(() => (type === 'expense' ? [...EXPENSE_CATEGORIES] : [...INCOME_CATEGORIES]), [type]);

  const parsedAmount = useMemo(() => {
    const n = Number(amount.replace(/,/g, '.'));
    return Number.isFinite(n) ? n : NaN;
  }, [amount]);

  const canSubmit = Number.isFinite(parsedAmount) && parsedAmount > 0 && category.trim().length > 0 && !isSaving;

  const submit = async () => {
    if (!canSubmit) return;
    setError(null);
    setIsSaving(true);
    try {
      // Use midday local time to reduce timezone date-shift surprises.
      const occurredAt = toIsoDateTime(new Date(`${date}T12:00:00`));
      await createTransaction({
        type,
        amount: parsedAmount,
        category,
        description,
        occurredAt
      });
      nav.goBack();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add transaction');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Pressable
          onPress={() => nav.goBack()}
          style={({ pressed }) => [
            {
              width: 44,
              height: 44,
              borderRadius: 18,
              backgroundColor: theme.colors.surface,
              borderWidth: 1,
              borderColor: theme.colors.border,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.92 : 1,
              transform: [{ scale: pressed ? 0.985 : 1 }]
            }
          ]}
        >
          <ArrowLeft color={theme.colors.text} size={20} />
        </Pressable>
        <View style={{ marginLeft: 12, flex: 1 }}>
          <H1 style={{ marginBottom: 0 }}>Add Transaction</H1>
        </View>
      </View>

      <View style={{ marginTop: 14 }}>
        {error ? <InlineError message={error} /> : null}
        {isSaving ? <ActivityIndicator color={theme.colors.primary} /> : null}
      </View>

      <View style={{ marginTop: 10 }}>
        <Card>
          <Text style={{ color: theme.colors.text, fontWeight: '900', fontSize: 16 }}>Type</Text>
          <View style={{ flexDirection: 'row', marginTop: 10, gap: 10 }}>
            {(['expense', 'income'] as const).map((k) => {
              const active = type === k;
              return (
                <Pressable
                  key={k}
                  onPress={() => {
                    setType(k);
                    setCategory('');
                  }}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      borderRadius: tokens.radius['2xl'],
                      paddingVertical: 12,
                      alignItems: 'center',
                      backgroundColor: active ? theme.colors.primary : theme.colors.surfaceAlt,
                      opacity: pressed ? 0.92 : 1,
                      transform: [{ scale: pressed ? 0.985 : 1 }]
                    }
                  ]}
                >
                  <Text style={{ color: active ? tokens.colors.white : theme.colors.text, fontWeight: '900' }}>
                    {k === 'expense' ? 'Expense' : 'Income'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={{ marginTop: 14 }}>
            <TextField
              label={`Amount${user?.currency ? ` (${user.currency})` : ''}`}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
            <TextField label="Description" value={description} onChangeText={setDescription} placeholder="Optional note…" />
            <TextField label="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />
          </View>

          <Text style={{ color: theme.colors.text, fontWeight: '900', fontSize: 16, marginTop: 6 }}>Category</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
            {categories.map((c) => {
              const active = category === c;
              return (
                <Pressable
                  key={c}
                  onPress={() => setCategory(c)}
                  style={({ pressed }) => [
                    {
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: active ? theme.colors.primary : theme.colors.border,
                      backgroundColor: active ? theme.colors.primary : theme.colors.surface,
                      opacity: pressed ? 0.92 : 1,
                      transform: [{ scale: pressed ? 0.985 : 1 }]
                    }
                  ]}
                >
                  <Text style={{ color: active ? tokens.colors.white : theme.colors.text, fontWeight: '800' }}>{c}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <View style={{ flex: 1 }}>
              <SecondaryButton title="Cancel" onPress={() => nav.goBack()} disabled={isSaving} />
            </View>
            <View style={{ flex: 1 }}>
              <PrimaryButton title="Save" onPress={submit} disabled={!canSubmit} />
            </View>
          </View>
        </Card>
      </View>
    </Screen>
  );
}
