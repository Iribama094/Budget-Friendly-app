import React from 'react';
import { motion } from 'framer-motion';
interface OnboardingScreenProps {
  title: string;
  subtitle: string;
  illustration: string;
  illustrationAlt: string;
}
export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  title,
  subtitle,
  illustration,
  illustrationAlt
}) => {
  return <div className="flex flex-col h-full">
      <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100">
        <motion.img
          src={illustration}
          alt={illustrationAlt}
          className="object-cover w-full h-full"
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent"></div>

        {/* Floating elements */}
        <motion.div
          className="absolute top-8 right-8 w-4 h-4 bg-primary-400 rounded-full"
          animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-12 left-8 w-3 h-3 bg-secondary-400 rounded-full"
          animate={{ y: [0, -8, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        />
      </div>

      <motion.div
        className="flex flex-col items-center px-8 pt-8 pb-32 text-center flex-1"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <motion.h1
          className="text-2xl font-bold font-display bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="text-gray-600 text-base leading-relaxed font-medium max-w-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {subtitle}
        </motion.p>
      </motion.div>
    </div>;
};