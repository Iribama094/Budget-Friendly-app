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
      <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
        <motion.img src={illustration} alt={illustrationAlt} className="object-cover w-full h-full" initial={{
        scale: 1.2,
        opacity: 0
      }} animate={{
        scale: 1,
        opacity: 1
      }} transition={{
        duration: 0.8
      }} />
        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-70"></div>
      </div>
      <motion.div className="flex flex-col items-center px-8 pt-12 text-center" initial={{
      y: 20,
      opacity: 0
    }} animate={{
      y: 0,
      opacity: 1
    }} transition={{
      delay: 0.3,
      duration: 0.5
    }}>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className="mt-4 text-gray-600">{subtitle}</p>
      </motion.div>
    </div>;
};