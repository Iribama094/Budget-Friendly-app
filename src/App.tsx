import React, { useState } from 'react';
import { OnboardingContainer } from './components/Onboarding/OnboardingContainer';
import { Dashboard } from './components/Dashboard/Dashboard';
import { LoginPage } from './components/Auth/LoginPage';
import { SplashScreen } from './components/Splash/SplashScreen';
import { AppBackground } from './components/Background/AppBackground';
import { ThemeProvider } from './contexts/ThemeContext';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'onboarding' | 'login' | 'dashboard'>('splash');

  const handleSplashComplete = () => {
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = () => {
    setCurrentScreen('login');
  };

  const handleLogin = () => {
    setCurrentScreen('dashboard');
  };

  return (
    <ThemeProvider>
      <div className="w-full min-h-screen font-sans antialiased relative bg-white dark:bg-gray-900 transition-colors duration-300">
        <AppBackground />

        {currentScreen === 'splash' && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}

        {currentScreen === 'onboarding' && (
          <OnboardingContainer onComplete={handleOnboardingComplete} />
        )}

        {currentScreen === 'login' && (
          <LoginPage onLogin={handleLogin} />
        )}

        {currentScreen === 'dashboard' && (
          <Dashboard />
        )}
      </div>
    </ThemeProvider>
  );
}