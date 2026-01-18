import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';

import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { patchMe, calcTax } from '../api/endpoints';
import { Card, InlineError, PrimaryButton, Screen, SecondaryButton, TextField, H1 } from '../components/Common/ui';
import { tokens } from '../theme/tokens';

export function ProfileScreen() {
  const nav = useNavigation<any>();
  const { user, refreshUser, logout } = useAuth();
  const { theme, setMode, preference } = useTheme();

  const [name, setName] = useState(user?.name ?? '');
  const [currency, setCurrency] = useState(user?.currency ?? '');
  const [locale, setLocale] = useState(user?.locale ?? '');
  const [monthlyIncome, setMonthlyIncome] = useState(user?.monthlyIncome != null ? String(user.monthlyIncome) : '');
  const [country, setCountry] = useState(user?.taxProfile?.country ?? 'NG');
  const [withheldByEmployer, setWithheldByEmployer] = useState<boolean>(user?.taxProfile?.withheldByEmployer ?? false);
  const [netMonthlyIncomeTax, setNetMonthlyIncomeTax] = useState(user?.taxProfile?.netMonthlyIncome != null ? String(user.taxProfile.netMonthlyIncome) : '');
  const [optInTaxFeature, setOptInTaxFeature] = useState<boolean>(user?.taxProfile?.optInTaxFeature ?? false);
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimateResult, setEstimateResult] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const parsedIncome = useMemo(() => {
    if (!monthlyIncome.trim()) return null;
    const n = Number(monthlyIncome.replace(/,/g, '.'));
    return Number.isFinite(n) ? n : NaN;
  }, [monthlyIncome]);

  const save = async () => {
    setError(null);
    setSuccess(null);
    setIsSaving(true);
    try {
      if (typeof parsedIncome === 'number' && !Number.isFinite(parsedIncome)) {
        throw new Error('Monthly income must be a number');
      }

      await patchMe({
        name: name.trim() ? name.trim() : null,
        currency: currency.trim() ? currency.trim() : null,
        locale: locale.trim() ? locale.trim() : null,
        monthlyIncome: parsedIncome === null ? null : parsedIncome
      });

      const taxProfile: any = {
        country: country?.trim() || null,
        withheldByEmployer: !!withheldByEmployer,
        netMonthlyIncome: netMonthlyIncomeTax?.trim() ? Number(netMonthlyIncomeTax.replace(/,/g, '.')) : null,
        optInTaxFeature: !!optInTaxFeature
      };

      await patchMe({
        name: name.trim() ? name.trim() : null,
        currency: currency.trim() ? currency.trim() : null,
        locale: locale.trim() ? locale.trim() : null,
        monthlyIncome: parsedIncome === null ? null : parsedIncome,
        taxProfile
      });
      await refreshUser();
      setSuccess('Saved');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const estimateTax = async () => {
    setEstimateResult(null);
    setIsEstimating(true);
    try {
      // Determine gross annual to send to calcTax
      let grossAnnual: number | null = null;
      if (typeof parsedIncome === 'number' && Number.isFinite(parsedIncome)) {
        grossAnnual = parsedIncome * 12;
      } else if (netMonthlyIncomeTax?.trim()) {
        const n = Number(netMonthlyIncomeTax.replace(/,/g, '.'));
        if (Number.isFinite(n)) grossAnnual = n * 12;
      }

      if (!grossAnnual || !country) throw new Error('Provide a monthly income or net monthly amount to estimate');

      const res = await calcTax({ country: country as string, grossAnnual });
      setEstimateResult(res);
    } catch (e) {
      setEstimateResult({ error: e instanceof Error ? e.message : 'Estimate failed' });
    } finally {
      setIsEstimating(false);
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
          <H1 style={{ marginBottom: 0 }}>Profile</H1>
        </View>
      </View>

      <View style={{ marginTop: 14 }}>
        {error ? <InlineError message={error} /> : null}
        {isSaving ? <ActivityIndicator color={theme.colors.primary} /> : null}
      </View>

      <View style={{ marginTop: 10 }}>
        <Card>
          <Text style={{ color: theme.colors.textMuted, fontWeight: '800' }}>Account</Text>
          <Text style={{ color: theme.colors.text, fontWeight: '900', fontSize: 16, marginTop: 6 }}>{user?.email ?? '—'}</Text>

          {success ? <Text style={{ color: theme.colors.success, fontWeight: '800', marginTop: 10 }}>{success}</Text> : null}

          <View style={{ marginTop: 14 }}>
            <TextField label="Name" value={name} onChangeText={setName} placeholder="Your name" />
            <TextField label="Currency (e.g. ₦ or USD)" value={currency} onChangeText={setCurrency} placeholder="₦" />
            <TextField label="Locale (e.g. en-NG)" value={locale} onChangeText={setLocale} placeholder="en-NG" />
            <TextField
              label="Monthly Income"
              value={monthlyIncome}
              onChangeText={setMonthlyIncome}
              placeholder="0"
              keyboardType="decimal-pad"
            />

            <View style={{ marginTop: 12 }}>
              <Text style={{ color: theme.colors.textMuted, fontWeight: '800' }}>Tax Settings</Text>
              <View style={{ marginTop: 8 }}>
                <TextField label="Country (ISO)" value={country} onChangeText={setCountry} placeholder="NG" />

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                  <Text style={{ color: theme.colors.text, fontWeight: '700' }}>Withheld by employer</Text>
                  <Switch value={withheldByEmployer} onValueChange={setWithheldByEmployer} />
                </View>

                <TextField
                  label="Net Monthly (if withheld)"
                  value={netMonthlyIncomeTax}
                  onChangeText={setNetMonthlyIncomeTax}
                  placeholder="0"
                  keyboardType="decimal-pad"
                />

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                  <Text style={{ color: theme.colors.text, fontWeight: '700' }}>Enable tax features</Text>
                  <Switch value={optInTaxFeature} onValueChange={setOptInTaxFeature} />
                </View>

                <View style={{ marginTop: 10 }}>
                  <SecondaryButton title={isEstimating ? 'Estimating…' : 'Estimate Tax'} onPress={estimateTax} disabled={isEstimating} />
                </View>

                {estimateResult ? (
                  <View style={{ marginTop: 10 }}>
                    {'error' in estimateResult ? (
                      <Card style={{ padding: 12 }}>
                        <Text style={{ color: theme.colors.error }}>{estimateResult.error}</Text>
                      </Card>
                    ) : (
                      // Render a human-friendly estimate if expected keys exist
                      <Card style={{ padding: 12 }}>
                        <Text style={{ color: theme.colors.text, fontWeight: '800' }}>Tax Estimate</Text>
                        <View style={{ marginTop: 8 }}>
                          {typeof estimateResult.grossAnnual === 'number' ? (
                            <Text style={{ color: theme.colors.textMuted }}>Gross annual: {estimateResult.grossAnnual.toLocaleString()}</Text>
                          ) : null}
                          {typeof estimateResult.totalTax === 'number' ? (
                            <Text style={{ color: theme.colors.text, fontWeight: '900', marginTop: 6 }}>Tax due: {formatMoney(estimateResult.totalTax, user?.currency ?? '₦')}</Text>
                          ) : null}
                          {typeof estimateResult.netAnnual === 'number' ? (
                            <Text style={{ color: theme.colors.textMuted, marginTop: 6 }}>Net annual: {formatMoney(estimateResult.netAnnual, user?.currency ?? '₦')}</Text>
                          ) : null}
                          {typeof estimateResult.netMonthly === 'number' ? (
                            <Text style={{ color: theme.colors.textMuted, marginTop: 4 }}>Net monthly: {formatMoney(estimateResult.netMonthly, user?.currency ?? '₦')}</Text>
                          ) : null}

                          {Array.isArray(estimateResult.bands) && estimateResult.bands.length ? (
                            <View style={{ marginTop: 10 }}>
                              <Text style={{ color: theme.colors.text, fontWeight: '800' }}>Breakdown</Text>
                              {estimateResult.bands.map((b: any, i: number) => (
                                <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                                  <Text style={{ color: theme.colors.textMuted }}>{b.label || `${b.rate}%`}</Text>
                                  <Text style={{ color: theme.colors.text, fontWeight: '900' }}>{formatMoney(b.amount ?? 0, user?.currency ?? '₦')}</Text>
                                </View>
                              ))}
                            </View>
                          ) : null}

                          {/* Fallback: show raw JSON if no known keys found */}
                          {!(typeof estimateResult.totalTax === 'number' || Array.isArray(estimateResult.bands)) ? (
                            <Text style={{ color: theme.colors.textMuted, marginTop: 8 }}>{JSON.stringify(estimateResult)}</Text>
                          ) : null}
                        </View>
                      </Card>
                    )}
                  </View>
                ) : null}
              </View>
            </View>
          </View>

          <Text style={{ color: theme.colors.text, fontWeight: '900', fontSize: 16, marginTop: 6 }}>Theme</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            {(
              [
                { key: 'system', label: 'System' },
                { key: 'light', label: 'Light' },
                { key: 'dark', label: 'Dark' }
              ] as const
            ).map((opt) => {
              const active = preference === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => setMode(opt.key)}
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
                  <Text style={{ color: active ? tokens.colors.white : theme.colors.text, fontWeight: '900' }}>{opt.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <View style={{ flex: 1 }}>
              <SecondaryButton title="Log out" onPress={() => void logout()} disabled={isSaving} />
            </View>
            <View style={{ flex: 1 }}>
              <PrimaryButton title="Save" onPress={save} disabled={isSaving} />
            </View>
          </View>
        </Card>
      </View>
    </Screen>
  );
}
