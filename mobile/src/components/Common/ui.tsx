import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  type TextInputProps,
  type ViewProps,
  type TextProps
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { tokens } from '../../theme/tokens';

export function Screen({ children, style }: { children: React.ReactNode; style?: ViewProps['style'] }) {
  const { theme } = useTheme();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
      <View style={[styles.screen, { backgroundColor: 'transparent' }, style]}>{children}</View>
      <View style={{ height: 98 }} />
      {/* bottom spacer for floating tab bar */}
    </SafeAreaView>
  );
}

export function H1(props: TextProps) {
  const { theme } = useTheme();
  return <Text {...props} style={[{ color: theme.colors.text }, styles.h1, props.style]} />;
}

export function P(props: TextProps) {
  const { theme } = useTheme();
  return <Text {...props} style={[{ color: theme.colors.textMuted }, styles.p, props.style]} />;
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewProps['style'] }) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          // subtle elevation for a modern card look
          shadowColor: theme.mode === 'dark' ? '#000' : '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: theme.mode === 'dark' ? 0.12 : 0.06,
          shadowRadius: 12,
          elevation: 4
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

export function Divider() {
  const { theme } = useTheme();
  return <View style={{ height: 1, backgroundColor: theme.colors.border, opacity: 0.9 }} />;
}

export function PrimaryButton({
  title,
  onPress,
  disabled
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.primaryButton,
        {
          backgroundColor: theme.colors.primary,
          opacity: disabled ? 0.7 : pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }]
        }
      ]}
    >
      <Text style={[styles.primaryButtonText, { color: tokens.colors.white }]}>{title}</Text>
    </Pressable>
  );
}

export function SecondaryButton({
  title,
  onPress,
  disabled
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.secondaryButton,
        {
          borderColor: theme.colors.primary,
          opacity: disabled ? 0.7 : pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }]
        }
      ]}
    >
      <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>{title}</Text>
    </Pressable>
  );
}

export function TextField({
  label,
  error,
  ...props
}: TextInputProps & { label: string; error?: string | null }) {
  const { theme } = useTheme();
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor={theme.colors.textMuted}
        style={[
          styles.input,
          {
            borderColor: error ? theme.colors.error : theme.colors.border,
            backgroundColor: theme.colors.surfaceAlt,
            color: theme.colors.text,
            // subtle inner shadow / depth
            shadowColor: theme.mode === 'dark' ? '#000' : '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: theme.mode === 'dark' ? 0.06 : 0.03,
            shadowRadius: 6,
            elevation: 1
          }
        ]}
      />
      {error ? <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text> : null}
    </View>
  );
}

export function InlineError({ message }: { message: string }) {
  const { theme } = useTheme();
  return (
    <View style={[styles.errorBox, { backgroundColor: theme.mode === 'dark' ? 'transparent' : tokens.colors.error[50], borderColor: theme.colors.error }]}>
      <Text style={[styles.errorBoxText, { color: theme.colors.error }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  screen: { flex: 1, paddingHorizontal: 18, paddingTop: 18 },
  h1: { fontSize: 28, fontWeight: '800' },
  p: { fontSize: 14, fontWeight: '500' },
  card: {
    borderWidth: 1,
    borderRadius: tokens.radius['3xl'],
    padding: 16
  },
  label: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: tokens.radius['2xl'],
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16
  },
  errorText: { marginTop: 6, fontSize: 12, fontWeight: '600' },
  primaryButton: {
    borderRadius: tokens.radius['2xl'],
    paddingVertical: 14,
    alignItems: 'center'
  },
  primaryButtonText: { fontWeight: '800', fontSize: 15 },
  secondaryButton: {
    borderRadius: tokens.radius['2xl'],
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1
  },
  secondaryButtonText: { fontWeight: '800', fontSize: 15 },
  errorBox: {
    borderWidth: 1,
    borderRadius: tokens.radius['2xl'],
    padding: 12,
    marginBottom: 12
  },
  errorBoxText: { fontWeight: '700' }
});
