import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, TrendingUpIcon, TrendingDownIcon, AlertTriangleIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
interface AnalyticsProps {
  onBack: () => void;
}
interface CategoryData {
  name: string;
  value: number;
  color: string;
}
interface TimelineData {
  name: string;
  food: number;
  transport: number;
  shopping: number;
  bills: number;
  misc: number;
}
export const Analytics: React.FC<AnalyticsProps> = ({
  onBack
}) => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // Mock data for pie chart with theme colors - changes based on timeframe
  const getCategoryData = (): CategoryData[] => {
    switch (timeframe) {
      case 'daily':
        return [{
          name: 'Food',
          value: 4000,
          color: '#10b981' // primary-500
        }, {
          name: 'Transport',
          value: 1500,
          color: '#f97316' // secondary-500
        }, {
          name: 'Shopping',
          value: 4700,
          color: '#f59e0b' // accent-500
        }, {
          name: 'Bills',
          value: 7000,
          color: '#059669' // success-600
        }, {
          name: 'Misc',
          value: 850,
          color: '#dc2626' // error-600
        }];
      case 'monthly':
        return [{
          name: 'Food',
          value: 120000,
          color: '#10b981' // primary-500
        }, {
          name: 'Transport',
          value: 58000,
          color: '#f97316' // secondary-500
        }, {
          name: 'Shopping',
          value: 100000,
          color: '#f59e0b' // accent-500
        }, {
          name: 'Bills',
          value: 75000,
          color: '#059669' // success-600
        }, {
          name: 'Misc',
          value: 41500,
          color: '#dc2626' // error-600
        }];
      default: // weekly
        return [{
          name: 'Food',
          value: 25000,
          color: '#10b981' // primary-500
        }, {
          name: 'Transport',
          value: 15000,
          color: '#f97316' // secondary-500
        }, {
          name: 'Shopping',
          value: 20000,
          color: '#f59e0b' // accent-500
        }, {
          name: 'Bills',
          value: 30000,
          color: '#059669' // success-600
        }, {
          name: 'Misc',
          value: 10000,
          color: '#dc2626' // error-600
        }];
    }
  };

  const categoryData = getCategoryData();
  // Mock data for different timeframes
  const dailyData: TimelineData[] = [{
    name: '6h ago',
    food: 500,
    transport: 300,
    shopping: 200,
    bills: 0,
    misc: 100
  }, {
    name: '12h ago',
    food: 800,
    transport: 0,
    shopping: 1500,
    bills: 0,
    misc: 200
  }, {
    name: '18h ago',
    food: 1200,
    transport: 400,
    shopping: 0,
    bills: 2000,
    misc: 150
  }, {
    name: 'Yesterday',
    food: 2500,
    transport: 800,
    shopping: 3000,
    bills: 5000,
    misc: 400
  }];

  const weeklyData: TimelineData[] = [{
    name: 'Mon',
    food: 3000,
    transport: 1500,
    shopping: 0,
    bills: 0,
    misc: 500
  }, {
    name: 'Tue',
    food: 2000,
    transport: 1500,
    shopping: 5000,
    bills: 0,
    misc: 0
  }, {
    name: 'Wed',
    food: 3500,
    transport: 1500,
    shopping: 0,
    bills: 15000,
    misc: 0
  }, {
    name: 'Thu',
    food: 2500,
    transport: 3000,
    shopping: 0,
    bills: 0,
    misc: 1000
  }, {
    name: 'Fri',
    food: 4000,
    transport: 1500,
    shopping: 8000,
    bills: 0,
    misc: 2000
  }, {
    name: 'Sat',
    food: 6000,
    transport: 1500,
    shopping: 7000,
    bills: 0,
    misc: 3500
  }, {
    name: 'Sun',
    food: 4000,
    transport: 4500,
    shopping: 0,
    bills: 15000,
    misc: 3000
  }];

  const monthlyData: TimelineData[] = [{
    name: 'Week 1',
    food: 28500,
    transport: 12400,
    shopping: 22800,
    bills: 19500,
    misc: 9000
  }, {
    name: 'Week 2',
    food: 31200,
    transport: 15600,
    shopping: 18900,
    bills: 25000,
    misc: 11200
  }, {
    name: 'Week 3',
    food: 26800,
    transport: 13800,
    shopping: 31500,
    bills: 8500,
    misc: 8900
  }, {
    name: 'Week 4',
    food: 33500,
    transport: 16200,
    shopping: 26800,
    bills: 22000,
    misc: 12400
  }];

  // Get current data based on timeframe
  const getCurrentData = () => {
    switch (timeframe) {
      case 'daily':
        return dailyData;
      case 'monthly':
        return monthlyData;
      default:
        return weeklyData;
    }
  };

  const currentData = getCurrentData();

  // Calculate total spending based on current timeframe
  const getTotalSpending = () => {
    switch (timeframe) {
      case 'daily':
        return 15800; // Last 24 hours
      case 'monthly':
        return 445600; // This month
      default:
        return categoryData.reduce((sum, category) => sum + category.value, 0); // This week
    }
  };

  const totalSpending = getTotalSpending();
  // Insights data - changes based on timeframe
  const getInsights = () => {
    switch (timeframe) {
      case 'daily':
        return [{
          type: 'warning',
          title: 'High Shopping Today',
          description: 'You spent ₦4,700 on shopping today - 30% above daily average.',
          icon: <TrendingUpIcon className="w-5 h-5 text-secondary-600" />,
          color: 'bg-secondary-50 border-secondary-200 text-secondary-800'
        }, {
          type: 'positive',
          title: 'Transport Savings',
          description: 'You saved ₦500 on transport compared to yesterday.',
          icon: <TrendingDownIcon className="w-5 h-5 text-primary-600" />,
          color: 'bg-primary-50 border-primary-200 text-primary-800'
        }];
      case 'monthly':
        return [{
          type: 'positive',
          title: 'Monthly Budget On Track',
          description: 'You\'re 15% under budget this month with 5 days remaining.',
          icon: <TrendingDownIcon className="w-5 h-5 text-primary-600" />,
          color: 'bg-primary-50 border-primary-200 text-primary-800'
        }, {
          type: 'warning',
          title: 'Food Spending High',
          description: 'Food expenses are 20% higher than last month.',
          icon: <TrendingUpIcon className="w-5 h-5 text-secondary-600" />,
          color: 'bg-secondary-50 border-secondary-200 text-secondary-800'
        }, {
          type: 'negative',
          title: 'Shopping Budget Exceeded',
          description: 'Shopping spending exceeded monthly budget by ₦25,000.',
          icon: <AlertTriangleIcon className="w-5 h-5 text-error-600" />,
          color: 'bg-error-50 border-error-200 text-error-800'
        }];
      default: // weekly
        return [{
          type: 'warning',
          title: 'Spending Spike',
          description: 'Your dining spend increased by 15% this week.',
          icon: <TrendingUpIcon className="w-5 h-5 text-secondary-600" />,
          color: 'bg-secondary-50 border-secondary-200 text-secondary-800'
        }, {
          type: 'positive',
          title: 'Consistent Saver',
          description: "You've maintained savings rate above 20% for 3 weeks",
          icon: <TrendingUpIcon className="w-5 h-5 text-primary-600" />,
          color: 'bg-primary-50 border-primary-200 text-primary-800'
        }, {
          type: 'negative',
          title: 'Overspent on Transport',
          description: 'Transport spending is 30% higher than your monthly average.',
          icon: <AlertTriangleIcon className="w-5 h-5 text-error-600" />,
          color: 'bg-error-50 border-error-200 text-error-800'
        }];
    }
  };

  const insights = getInsights();
  // Animation for pie chart slices
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  const onPieLeave = () => {
    setActiveIndex(null);
  };
  const handleCategoryClick = (name: string) => {
    setSelectedCategory(selectedCategory === name ? null : name);
  };
  // Custom tooltip for bar chart
  const CustomTooltip = ({
    active,
    payload
  }: any) => {
    if (active && payload && payload.length) {
      return <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-md border border-gray-200 dark:border-gray-700 text-xs">
          <p className="font-medium text-gray-800 dark:text-gray-200">{`₦${payload[0].value.toLocaleString()}`}</p>
          <p className="text-gray-600 dark:text-gray-400">{payload[0].name}</p>
        </div>;
    }
    return null;
  };
  return <div className="w-full min-h-screen py-6 pb-24 relative">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <motion.button
            className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm shadow-soft flex items-center justify-center mr-4 border border-white/20"
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </motion.button>
          <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
            Spending Insights 📊
          </h1>
        </div>
        {/* Timeframe Toggle */}
        <div className="flex bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-1 mb-6 shadow-soft border border-white/20 dark:border-gray-700/20">
          <button className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${timeframe === 'daily' ? 'bg-primary-100 text-primary-700 shadow-soft' : 'text-gray-600 hover:text-primary-600'}`} onClick={() => setTimeframe('daily')}>
            Daily
          </button>
          <button className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${timeframe === 'weekly' ? 'bg-primary-100 text-primary-700 shadow-soft' : 'text-gray-600 hover:text-primary-600'}`} onClick={() => setTimeframe('weekly')}>
            Weekly
          </button>
          <button className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${timeframe === 'monthly' ? 'bg-primary-100 text-primary-700 shadow-soft' : 'text-gray-600 hover:text-primary-600'}`} onClick={() => setTimeframe('monthly')}>
            Monthly
          </button>
        </div>
        {/* Total Spending */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-sm border border-white/20 dark:border-gray-700/20">
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Spending</h3>
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            ₦{totalSpending.toLocaleString()}
          </div>
        </div>
        {/* Category Breakdown */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-sm border border-white/20 dark:border-gray-700/20">
          <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-4">Category Breakdown</h3>
          <div className="flex">
            {/* Pie Chart */}
            <div className="w-1/2">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={activeIndex !== null ? 70 : 60} paddingAngle={2} dataKey="value" onMouseEnter={onPieEnter} onMouseLeave={onPieLeave} animationBegin={0} animationDuration={1000}>
                    {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" style={{
                    filter: activeIndex === index ? 'drop-shadow(0px 0px 4px rgba(0,0,0,0.3))' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }} onClick={() => handleCategoryClick(entry.name)} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="w-1/2 pl-2 flex flex-col justify-center">
              {categoryData.map((category) => <motion.div key={category.name} className="flex items-center mb-2 cursor-pointer" whileHover={{
              scale: 1.05
            }} animate={{
              opacity: selectedCategory === null || selectedCategory === category.name ? 1 : 0.5
            }} onClick={() => handleCategoryClick(category.name)}>
                  <div className="w-3 h-3 rounded-full mr-2" style={{
                backgroundColor: category.color
              }} />
                  <div className="text-sm flex-1 text-gray-800 dark:text-gray-200">{category.name}</div>
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    ₦{category.value.toLocaleString()}
                  </div>
                </motion.div>)}
            </div>
          </div>
        </div>
        {/* Timeline Chart */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-sm border border-white/20 dark:border-gray-700/20">
          <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-4">
            {timeframe === 'daily' ? 'Daily Trend' : timeframe === 'monthly' ? 'Monthly Trend' : 'Weekly Trend'}
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={currentData} margin={{
            top: 10,
            right: 0,
            left: -20,
            bottom: 0
          }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis hide={true} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={selectedCategory?.toLowerCase() || 'food'} stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={1000} hide={selectedCategory !== null && selectedCategory !== 'Food'} />
              <Bar dataKey="transport" stackId="a" fill="#f97316" radius={[4, 4, 0, 0]} animationDuration={1000} hide={selectedCategory !== null && selectedCategory !== 'Transport'} />
              <Bar dataKey="shopping" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} animationDuration={1000} hide={selectedCategory !== null && selectedCategory !== 'Shopping'} />
              <Bar dataKey="bills" stackId="a" fill="#059669" radius={[4, 4, 0, 0]} animationDuration={1000} hide={selectedCategory !== null && selectedCategory !== 'Bills'} />
              <Bar dataKey="misc" stackId="a" fill="#dc2626" radius={[4, 4, 0, 0]} animationDuration={1000} hide={selectedCategory !== null && selectedCategory !== 'Misc'} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Spending Insights */}
        <div className="space-y-4 mb-6">
          <h3 className="font-medium text-gray-800 dark:text-gray-200">Spending Insights</h3>
          {insights.map((insight, index) => <motion.div key={index} className={`p-4 rounded-xl border ${insight.color}`} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: index * 0.1
        }}>
              <div className="flex items-center mb-1">
                {insight.icon}
                <h4 className="font-medium ml-2">{insight.title}</h4>
              </div>
              <p className="text-sm">{insight.description}</p>
            </motion.div>)}
        </div>
      </div>
    </div>;
};