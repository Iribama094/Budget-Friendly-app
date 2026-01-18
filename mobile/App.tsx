import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Home, Wallet, BarChart3, Target } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { AppBackground } from './src/components/Common/AppBackground';
import { tokens } from './src/theme/tokens';
import { LoginScreen } from './src/screens/LoginScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { TransactionsScreen } from './src/screens/TransactionsScreen';
import { GoalsScreen } from './src/screens/GoalsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { BudgetScreen } from './src/screens/BudgetScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { AddTransactionScreen } from './src/screens/AddTransactionScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { Pressable } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ONBOARDING_KEY = 'bf_onboarding_done_v1';

function MainTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.mode === 'dark' ? tokens.colors.gray[400] : tokens.colors.gray[500],
        tabBarStyle: {
          position: 'absolute',
          left: 14,
          right: 14,
          bottom: 14,
          height: Platform.select({ ios: 78, default: 72 }),
          paddingTop: 10,
          paddingBottom: Platform.select({ ios: 18, default: 12 }),
          borderRadius: tokens.radius['3xl'],
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderColor: theme.colors.border,
          // floating shadow
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.06,
          shadowRadius: 20,
          elevation: 12
        },
        tabBarIcon: ({ color, size }) => {
          const iconSize = Math.max(20, Math.min(size, 24));
          if (route.name === 'Dashboard') return <Home color={color} size={iconSize} />;
          if (route.name === 'Budget') return <Wallet color={color} size={iconSize} />;
          if (route.name === 'Analytics') return <BarChart3 color={color} size={iconSize} />;
          if (route.name === 'Goals') return <Target color={color} size={iconSize} />;
          return <Home color={color} size={iconSize} />;
        }
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Budget" component={BudgetScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Goals" component={GoalsScreen} />
    </Tab.Navigator>
  );
}

function AuthedStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background }
      }}
    >
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Transactions" component={TransactionsScreen} />
      <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
    </Stack.Navigator>
  );
}

function Root() {
  const { user, isLoading } = useAuth();
  const { theme } = useTheme();

  const [onboardingDone, setOnboardingDone] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const v = await SecureStore.getItemAsync(ONBOARDING_KEY);
        setOnboardingDone(v === '1');
      } catch {
        setOnboardingDone(false);
      }
    })();
  }, []);

  const markOnboardingDone = async () => {
    setOnboardingDone(true);
    try {
      await SecureStore.setItemAsync(ONBOARDING_KEY, '1');
    } catch {
      // ignore
    }
  };

  if (isLoading || onboardingDone === null) return <SplashScreen />;
  if (!user && onboardingDone === false) return <OnboardingScreen onDone={() => void markOnboardingDone()} />;
  if (!user) return <LoginScreen />;

  return (
    <View style={{ flex: 1 }}>
      <AuthedStack />
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

function FloatingThemeToggle() {
  const { toggleDarkMode, isDarkMode, theme } = useTheme();
  return (
    <Pressable
      onPress={() => toggleDarkMode()}
      style={({ pressed }) => [
        {
          position: 'absolute',
          right: 18,
          bottom: Platform.select({ ios: 96, default: 86 }),
          width: 52,
          height: 52,
          borderRadius: 52,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.surface,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 6,
          opacity: pressed ? 0.9 : 1
        }
      ]}
    >
      {isDarkMode ? <Sun color={theme.colors.primary} size={20} /> : <Moon color={theme.colors.primary} size={20} />}
    </Pressable>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <NavigationContainer>
            <View style={styles.container}>
              <AppBackground />
              <Root />
              <FloatingThemeToggle />
            </View>
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});
