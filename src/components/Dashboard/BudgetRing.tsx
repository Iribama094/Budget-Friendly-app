import React from 'react';
import { motion } from 'framer-motion';

interface BudgetRingProps {
  percentage: number;
  spent: number;
  total: number;
  currency: string;
}

export const BudgetRing: React.FC<BudgetRingProps> = ({
  percentage,
  spent,
  total,
  currency
}) => {
  const radius = 85;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  // Dynamic color based on percentage
  const getGradientColors = (percent: number) => {
    if (percent <= 50) return { start: '#22c55e', end: '#16a34a' }; // Green
    if (percent <= 75) return { start: '#f97316', end: '#ea580c' }; // Orange
    return { start: '#ef4444', end: '#dc2626' }; // Red
  };

  const colors = getGradientColors(percentage);

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 blur-xl opacity-30"></div>

      {/* Main container with glassmorphism effect */}
      <div className="relative bg-white/80 backdrop-blur-sm rounded-full p-6 shadow-large border border-white/20">
        <svg width="220" height="220" viewBox="0 0 220 220" className="drop-shadow-soft">
          {/* Background ring with subtle gradient */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="url(#backgroundGradient)"
            strokeWidth={strokeWidth}
            opacity="0.1"
          />

          {/* Progress ring */}
          <motion.circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (percentage / 100) * circumference }}
            transition={{ duration: 2, ease: 'easeOut', delay: 0.3 }}
            strokeLinecap="round"
            transform="rotate(-90 110 110)"
            filter="url(#glow)"
          />

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>

            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.start} />
              <stop offset="100%" stopColor={colors.end} />
            </linearGradient>

            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.p
            className="text-gray-500 text-sm font-medium mb-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Monthly Budget
          </motion.p>

          <motion.p
            className="text-4xl font-bold font-display bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.6, type: 'spring', stiffness: 200 }}
          >
            {percentage}%
          </motion.p>

          <motion.div
            className="text-sm text-gray-600 mt-1 space-y-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <div className="flex items-center justify-center space-x-1">
              <span className="font-semibold text-primary-600">
                {currency}{spent.toLocaleString()}
              </span>
              <span className="text-gray-400">of</span>
              <span className="font-medium text-gray-700">
                {currency}{total.toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {currency}{(total - spent).toLocaleString()} remaining
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};