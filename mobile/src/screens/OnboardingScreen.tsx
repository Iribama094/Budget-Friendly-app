import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Card, P, PrimaryButton, Screen, H1 } from '../components/Common/ui';
import { tokens } from '../theme/tokens';

type Props = {
  onDone: () => void;
};

type Slide = {
  title: string;
  subtitle: string;
};

export function OnboardingScreen({ onDone }: Props) {
  const { theme } = useTheme();

  const slides = useMemo<Slide[]>(
    () => [
      { title: 'Track everything', subtitle: 'Log income and expenses in seconds to understand your spending.' },
      { title: 'Build a budget', subtitle: 'Set a monthly budget and keep category spending on track.' },
      { title: 'See your progress', subtitle: 'Analytics help you spot patterns and improve month over month.' }
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const isLast = index === slides.length - 1;

  return (
    <Screen style={{ paddingTop: 8 }}>
      <View
        style={{
          height: 220,
          borderRadius: tokens.radius['3xl'],
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Image
          source={require('../../assets/icon.png')}
          style={{ width: 86, height: 86, borderRadius: 24 }}
          resizeMode="contain"
        />
        <Text style={{ color: theme.colors.text, fontWeight: '900', fontSize: 22, marginTop: 14 }}>BudgetFriendly</Text>
        <Text style={{ color: theme.colors.textMuted, fontWeight: '700', marginTop: 6 }}>Smarter budgeting, daily.</Text>

        {/* Decorative dots */}
        <View
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            width: 14,
            height: 14,
            borderRadius: 999,
            backgroundColor: theme.colors.primary,
            opacity: 0.35
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 22,
            left: 18,
            width: 12,
            height: 12,
            borderRadius: 999,
            backgroundColor: tokens.colors.secondary[500],
            opacity: 0.28
          }}
        />
      </View>

      <View style={{ marginTop: 14 }}>
        <Card>
          <H1 style={{ marginBottom: 6 }}>{slides[index].title}</H1>
          <P style={{ marginTop: 10, fontSize: 15, lineHeight: 22 }}>{slides[index].subtitle}</P>

          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 16 }}>
            {slides.map((_, i) => {
              const active = i === index;
              return (
                <View
                  key={i}
                  style={{
                    width: active ? 24 : 10,
                    height: 10,
                    borderRadius: 999,
                    backgroundColor: active ? theme.colors.primary : theme.colors.border
                  }}
                />
              );
            })}
          </View>

          <View style={{ marginTop: 16 }}>
            <PrimaryButton
              title={isLast ? 'Get Started' : 'Next'}
              onPress={() => {
                if (isLast) onDone();
                else setIndex((v) => Math.min(v + 1, slides.length - 1));
              }}
            />

            {!isLast ? (
              <Pressable onPress={onDone} style={({ pressed }) => [{ paddingVertical: 14, alignItems: 'center', opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] }] }>
                <Text style={{ color: theme.colors.textMuted, fontWeight: '800' }}>Skip</Text>
              </Pressable>
            ) : null}
          </View>
        </Card>
      </View>
    </Screen>
  );
}
