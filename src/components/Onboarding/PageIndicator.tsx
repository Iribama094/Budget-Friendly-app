import React from 'react';
import { motion } from 'framer-motion';
interface PageIndicatorProps {
  total: number;
  current: number;
}
export const PageIndicator: React.FC<PageIndicatorProps> = ({
  total,
  current
}) => {
  return <div className="flex space-x-2">
      {Array.from({
      length: total
    }).map((_, i) => <motion.div key={i} className={`h-2 rounded-full ${i === current ? 'bg-purple-600' : 'bg-gray-300'}`} initial={false} animate={{
      width: i === current ? 20 : 8,
      opacity: i === current ? 1 : 0.5
    }} transition={{
      duration: 0.3
    }} />)}
    </div>;
};