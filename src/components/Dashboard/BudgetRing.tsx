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
  const radius = 80;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  return <div className="relative flex items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200">
        {/* Background ring */}
        <circle cx="100" cy="100" r={radius} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
        {/* Progress ring */}
        <motion.circle cx="100" cy="100" r={radius} fill="none" stroke="url(#gradient)" strokeWidth={strokeWidth} strokeDasharray={circumference} initial={{
        strokeDashoffset: circumference
      }} animate={{
        strokeDashoffset: circumference - percentage / 100 * circumference
      }} transition={{
        duration: 1.5,
        ease: 'easeOut'
      }} strokeLinecap="round" transform="rotate(-90 100 100)" />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center content */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <p className="text-gray-600 text-sm">Monthly Budget</p>
        <motion.p className="text-3xl font-bold text-gray-800" initial={{
        opacity: 0,
        scale: 0.8
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        delay: 0.5,
        duration: 0.5
      }}>
          {percentage}%
        </motion.p>
        <p className="text-sm text-gray-600">
          <span className="font-medium text-purple-600">
            {currency}
            {spent.toLocaleString()}
          </span>
          <span className="mx-1">/</span>
          <span>
            {currency}
            {total.toLocaleString()}
          </span>
        </p>
      </div>
    </div>;
};