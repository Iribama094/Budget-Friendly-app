import React, { useState } from 'react';
import { OnboardingContainer } from './components/Onboarding/OnboardingContainer';
import { Dashboard } from './components/Dashboard/Dashboard';
export function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const completeOnboarding = () => {
    setShowOnboarding(false);
  };
  return <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {showOnboarding ? <OnboardingContainer onComplete={completeOnboarding} /> : <Dashboard />}
    </div>;
}