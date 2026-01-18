import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Card, H1, InlineError, P, PrimaryButton, Screen, TextField } from '../components/Common/ui';
import { tokens } from '../theme/tokens';
import { LogoMark } from '../components/Common/LogoMark';

export function LoginScreen() {
  const auth = useAuth();
  const { theme } = useTheme();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const title = useMemo(() => (mode === 'login' ? 'Welcome Back' : 'Create Account'), [mode]);
  const subtitle = useMemo(
    () => (mode === 'login' ? 'Sign in to your BudgetFriendly account' : 'Start budgeting smarter today'),
    [mode]
  );

  const submit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      if (mode === 'register') {
        await auth.register(email.trim(), password, name.trim() ? name.trim() : undefined);
      } else {
        await auth.login(email.trim(), password);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen style={{ justifyContent: 'center' }}>
      <View style={{ alignItems: 'center', marginBottom: 18 }}>
        <View style={{ marginBottom: 12 }}>
          <LogoMark size={72} />
        </View>
        <H1 style={{ textAlign: 'center' }}>{title}</H1>
        <P style={{ marginTop: 6, textAlign: 'center' }}>{subtitle}</P>
      </View>

      <Card>
        {error ? <InlineError message={error} /> : null}

        {mode === 'register' ? (
          <TextField
            label="Name (optional)"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            placeholder="Enter your name"
          />
        ) : null}

        <TextField
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Enter your email"
        />

        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter your password"
        />

        <View style={{ marginTop: 6 }}>
          {isSubmitting ? (
            <View style={{ paddingVertical: 14, alignItems: 'center' }}>
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          ) : (
            <PrimaryButton title={mode === 'login' ? 'Sign In' : 'Create Account'} onPress={submit} />
          )}
        </View>

        <Pressable
          onPress={() => {
            setError(null);
            setMode(mode === 'login' ? 'register' : 'login');
          }}
          style={({ pressed }) => [{ paddingVertical: 14, alignItems: 'center', opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] }]}
        >
          <Text style={{ color: theme.colors.primary, fontWeight: '800' }}>
            {mode === 'login' ? "Don't have an account? Create one" : 'Already have an account? Sign in'}
          </Text>
        </Pressable>

        <Text style={{ color: theme.colors.textMuted, fontSize: 12, marginTop: 2, textAlign: 'center' }}>
          Set EXPO_PUBLIC_API_BASE_URL to your backend URL.
        </Text>
      </Card>
    </Screen>
  );
}
