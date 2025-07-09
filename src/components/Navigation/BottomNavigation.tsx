import React from 'react';
import { motion } from 'framer-motion';
import { Home, Wallet, BarChart3, Target } from 'lucide-react';

interface BottomNavigationProps {
  currentScreen: 'dashboard' | 'budget' | 'analytics' | 'goals';
  onScreenChange: (screen: 'dashboard' | 'budget' | 'analytics' | 'goals') => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentScreen,
  onScreenChange
}) => {
  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'Home',
      icon: Home,
      color: 'primary'
    },
    {
      id: 'budget' as const,
      label: 'Budget',
      icon: Wallet,
      color: 'secondary'
    },
    {
      id: 'analytics' as const,
      label: 'Analytics',
      icon: BarChart3,
      color: 'accent'
    },
    {
      id: 'goals' as const,
      label: 'Goals',
      icon: Target,
      color: 'primary'
    }
  ];

  const getActiveStyles = (isActive: boolean, color: string) => {
    if (!isActive) return 'text-gray-400';
    
    switch (color) {
      case 'primary':
        return 'text-primary-600';
      case 'secondary':
        return 'text-secondary-600';
      case 'accent':
        return 'text-accent-600';
      default:
        return 'text-primary-600';
    }
  };

  const getBackgroundStyles = (isActive: boolean, color: string) => {
    if (!isActive) return 'bg-transparent';
    
    switch (color) {
      case 'primary':
        return 'bg-primary-50 border-primary-100';
      case 'secondary':
        return 'bg-secondary-50 border-secondary-100';
      case 'accent':
        return 'bg-accent-50 border-accent-100';
      default:
        return 'bg-primary-50 border-primary-100';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Modern floating navigation */}
      <div className="flex justify-center pb-6 px-6">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-large border border-white/30 px-2 py-2">
          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = currentScreen === item.id;
              const Icon = item.icon;

              return (
                <motion.button
                  key={item.id}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-2xl min-w-[64px] transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600 shadow-glow'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onScreenChange(item.id)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  layout
                >
                  <motion.div
                    animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <Icon
                      className={`w-6 h-6 transition-colors duration-300 ${
                        isActive ? 'text-white' : 'text-gray-500'
                      }`}
                    />
                  </motion.div>

                  <motion.span
                    className={`text-xs font-semibold mt-1 transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-gray-500'
                    }`}
                    animate={isActive ? { opacity: 1 } : { opacity: 0.8 }}
                  >
                    {item.label}
                  </motion.span>

                  {/* Floating active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute -top-1 w-2 h-2 bg-accent-400 rounded-full shadow-glow-gold"
                      layoutId="activeIndicator"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}

                  {/* Ripple effect */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-white/20 rounded-2xl"
                      initial={{ scale: 0, opacity: 0.5 }}
                      animate={{ scale: 1, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Safe area for iOS */}
      <div className="h-6 bg-transparent"></div>
    </div>
  );
};
