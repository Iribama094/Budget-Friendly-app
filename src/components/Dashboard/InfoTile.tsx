import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Wallet, BarChart, TrendingUp, DollarSign } from 'lucide-react';

interface InfoTileProps {
  title: string;
  value: string;
  icon: 'calendar' | 'wallet' | 'chart' | 'trending' | 'dollar';
  color: 'blue' | 'green' | 'purple' | 'orange' | 'emerald';
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
    const iconClass = `w-5 h-5 ${getIconColor()}`;
    switch (icon) {
      case 'calendar':
        return <Calendar className={iconClass} />;
      case 'wallet':
        return <Wallet className={iconClass} />;
      case 'chart':
        return <BarChart className={iconClass} />;
      case 'trending':
        return <TrendingUp className={iconClass} />;
      case 'dollar':
        return <DollarSign className={iconClass} />;
      default:
        return <Wallet className={iconClass} />;
    }
  };

  const getIconColor = () => {
    switch (color) {
      case 'blue':
        return 'text-primary-600';
      case 'green':
        return 'text-success-600';
      case 'purple':
        return 'text-secondary-600';
      case 'orange':
        return 'text-warning-600';
      case 'emerald':
        return 'text-emerald-600';
      default:
        return 'text-primary-600';
    }
  };

  const getBgColor = () => {
    switch (color) {
      case 'blue':
        return 'bg-primary-50 border border-primary-100';
      case 'green':
        return 'bg-success-50 border border-success-100';
      case 'purple':
        return 'bg-secondary-50 border border-secondary-100';
      case 'orange':
        return 'bg-warning-50 border border-warning-100';
      case 'emerald':
        return 'bg-emerald-50 border border-emerald-100';
      default:
        return 'bg-primary-50 border border-primary-100';
    }
  };

  const getGradientBg = () => {
    switch (color) {
      case 'blue':
        return 'bg-gradient-to-br from-primary-500 to-primary-600';
      case 'green':
        return 'bg-gradient-to-br from-success-500 to-success-600';
      case 'purple':
        return 'bg-gradient-to-br from-secondary-500 to-secondary-600';
      case 'orange':
        return 'bg-gradient-to-br from-warning-500 to-warning-600';
      case 'emerald':
        return 'bg-gradient-to-br from-emerald-500 to-emerald-600';
      default:
        return 'bg-gradient-to-br from-primary-500 to-primary-600';
    }
  };

  return (
    <motion.div
      className={`relative p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 hover:shadow-medium transition-all duration-300 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-gray-50/30 rounded-2xl"></div>

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <motion.p
            className="text-sm font-medium text-gray-600 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.p>

          <motion.p
            className="text-2xl font-bold font-display text-gray-800 mb-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            {value}
          </motion.p>

          {children && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {children}
            </motion.div>
          )}
        </div>

        <motion.div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${getBgColor()} shadow-soft`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
          whileHover={{ scale: 1.1 }}
        >
          {getIcon()}
        </motion.div>
      </div>

      {/* Hover effect overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-2xl opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};