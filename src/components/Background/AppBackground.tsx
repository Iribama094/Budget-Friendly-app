import React from 'react';
import { motion } from 'framer-motion';

export const AppBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      
      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary-200/30 to-primary-300/20 rounded-full blur-2xl"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute top-40 right-16 w-24 h-24 bg-gradient-to-br from-secondary-200/30 to-secondary-300/20 rounded-full blur-xl"
        animate={{
          y: [0, 15, 0],
          scale: [1, 0.9, 1],
          opacity: [0.4, 0.6, 0.4]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <motion.div
        className="absolute bottom-32 left-20 w-40 h-40 bg-gradient-to-br from-accent-200/20 to-accent-300/15 rounded-full blur-3xl"
        animate={{
          y: [0, -25, 0],
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-8 w-28 h-28 bg-gradient-to-br from-primary-300/25 to-primary-400/15 rounded-full blur-2xl"
        animate={{
          y: [0, 20, 0],
          scale: [1, 0.8, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      />
      
      {/* Subtle financial pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="financial-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              {/* Dollar sign */}
              <circle cx="20" cy="20" r="2" fill="currentColor" className="text-primary-600" />
              <path d="M18 15 L18 25 M22 15 L22 25 M15 18 L25 18 M15 22 L25 22" stroke="currentColor" strokeWidth="0.5" className="text-primary-600" fill="none" />
              
              {/* Growth arrow */}
              <path d="M60 80 L80 60 M75 60 L80 60 L80 65" stroke="currentColor" strokeWidth="0.5" className="text-secondary-600" fill="none" />
              <circle cx="60" cy="80" r="1" fill="currentColor" className="text-secondary-600" />
              <circle cx="70" cy="70" r="1" fill="currentColor" className="text-secondary-600" />
              <circle cx="80" cy="60" r="1" fill="currentColor" className="text-secondary-600" />
              
              {/* Coin stack */}
              <ellipse cx="100" cy="100" rx="8" ry="2" fill="currentColor" className="text-accent-600" opacity="0.3" />
              <ellipse cx="100" cy="98" rx="8" ry="2" fill="currentColor" className="text-accent-600" opacity="0.4" />
              <ellipse cx="100" cy="96" rx="8" ry="2" fill="currentColor" className="text-accent-600" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#financial-pattern)" />
        </svg>
      </div>
      
      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-white/20" />
      
      {/* Top highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-200/50 to-transparent" />
    </div>
  );
};
