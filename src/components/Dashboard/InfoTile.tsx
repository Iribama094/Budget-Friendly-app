import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Wallet, BarChart } from 'lucide-react';
interface InfoTileProps {
  title: string;
  value: string;
  icon: 'calendar' | 'wallet' | 'chart';
  color: 'blue' | 'green' | 'purple';
  className?: string;
  children?: ReactNode;
}
export const InfoTile: React.FC<InfoTileProps> = ({
  title,
  value,
  icon,
  color,
  className = '',
  children
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'calendar':
        return <Calendar className={`w-5 h-5 ${getIconColor()}`} />;
      case 'wallet':
        return <Wallet className={`w-5 h-5 ${getIconColor()}`} />;
      case 'chart':
        return <BarChart className={`w-5 h-5 ${getIconColor()}`} />;
    }
  };
  const getIconColor = () => {
    switch (color) {
      case 'blue':
        return 'text-blue-500';
      case 'green':
        return 'text-green-500';
      case 'purple':
        return 'text-purple-600';
    }
  };
  const getBgColor = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100';
      case 'green':
        return 'bg-green-100';
      case 'purple':
        return 'bg-purple-100';
    }
  };
  return <motion.div className={`p-4 bg-white rounded-xl shadow-sm ${className}`} initial={{
    opacity: 0,
    y: 10
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.4
  }} whileHover={{
    y: -2
  }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-xl font-bold mt-1">{value}</p>
          {children}
        </div>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${getBgColor()}`}>
          {getIcon()}
        </div>
      </div>
    </motion.div>;
};