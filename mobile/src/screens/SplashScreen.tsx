import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { H1, P, Screen } from '../components/Common/ui';

export function SplashScreen() {
  const { theme } = useTheme();
  return (
    <Screen style={{ justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ alignItems: 'center' }}>
        <H1>BudgetFriendly</H1>
        <P style={{ marginTop: 8 }}>Preparing your dashboard…</P>
        <View style={{ marginTop: 18 }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    </Screen>
  );
}
