import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { tokens } from '../../theme/tokens';
import { hexToRgba } from '../../theme/color';

export function AppBackground() {
  const { theme } = useTheme();

  const base: [string, string] =
    theme.mode === 'dark'
      ? [tokens.colors.gray[950], tokens.colors.gray[900]]
      : [tokens.colors.primary[50], tokens.colors.white];

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.background }]} pointerEvents="none">
      <LinearGradient colors={base} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />

      <View
        style={[
          styles.blob,
          {
            top: 80,
            left: 24,
            width: 160,
            height: 160,
            borderRadius: 999,
            backgroundColor: hexToRgba(tokens.colors.primary[500], theme.mode === 'dark' ? 0.2 : 0.18)
          }
        ]}
      />

      <View
        style={[
          styles.blob,
          {
            top: 140,
            right: 40,
            width: 120,
            height: 120,
            borderRadius: 999,
            backgroundColor: hexToRgba(tokens.colors.secondary[500], theme.mode === 'dark' ? 0.18 : 0.16)
          }
        ]}
      />

      <View
        style={[
          styles.blob,
          {
            bottom: 120,
            left: 50,
            width: 220,
            height: 220,
            borderRadius: 999,
            backgroundColor: hexToRgba(tokens.colors.accent[500], theme.mode === 'dark' ? 0.16 : 0.14)
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute'
  }
});
