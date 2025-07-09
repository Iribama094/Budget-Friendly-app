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
  // Mock data for pie chart
  const categoryData: CategoryData[] = [{
    name: 'Food',
    value: 25000,
    color: '#f97316'
  }, {
    name: 'Transport',
    value: 15000,
    color: '#3b82f6'
  }, {
    name: 'Shopping',
    value: 20000,
    color: '#ec4899'
  }, {
    name: 'Bills',
    value: 30000,
    color: '#eab308'
  }, {
    name: 'Misc',
    value: 10000,
    color: '#8b5cf6'
  }];
  // Mock data for timeline
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
  // Calculate total spending
  const totalSpending = categoryData.reduce((sum, item) => sum + item.value, 0);
  // Insights data
  const insights = [{
    type: 'warning',
    title: 'Spending Spike',
    description: 'Your dining spend increased by 15% this week.',
    icon: <TrendingUpIcon className="w-5 h-5 text-orange-600" />,
    color: 'bg-orange-100 border-orange-200 text-orange-800'
  }, {
    type: 'positive',
    title: 'Consistent Saver',
    description: "You've maintained savings rate above 20% for 3 weeks",
    icon: <TrendingUpIcon className="w-5 h-5 text-green-600" />,
    color: 'bg-green-100 border-green-200 text-green-800'
  }, {
    type: 'negative',
    title: 'Overspent on Transport',
    description: 'Transport spending is 30% higher than your monthly average.',
    icon: <AlertTriangleIcon className="w-5 h-5 text-red-600" />,
    color: 'bg-red-100 border-red-200 text-red-800'
  }];
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
      return <div className="bg-white p-2 rounded shadow-md border text-xs">
          <p className="font-medium">{`₦${payload[0].value.toLocaleString()}`}</p>
          <p className="text-gray-600">{payload[0].name}</p>
        </div>;
    }
    return null;
  };
  return <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-6">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mr-4" onClick={onBack}>
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Spending Insights
          </h1>
        </div>
        {/* Timeframe Toggle */}
        <div className="flex bg-white rounded-xl p-1 mb-6 shadow-sm">
          <button className={`flex-1 py-2 text-sm font-medium rounded-lg ${timeframe === 'daily' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`} onClick={() => setTimeframe('daily')}>
            Daily
          </button>
          <button className={`flex-1 py-2 text-sm font-medium rounded-lg ${timeframe === 'weekly' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`} onClick={() => setTimeframe('weekly')}>
            Weekly
          </button>
          <button className={`flex-1 py-2 text-sm font-medium rounded-lg ${timeframe === 'monthly' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`} onClick={() => setTimeframe('monthly')}>
            Monthly
          </button>
        </div>
        {/* Total Spending */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <h3 className="text-sm text-gray-600 mb-1">Total Spending</h3>
          <div className="text-3xl font-bold text-gray-800">
            ₦{totalSpending.toLocaleString()}
          </div>
        </div>
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <h3 className="font-medium text-gray-800 mb-4">Category Breakdown</h3>
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
              {categoryData.map((category, index) => <motion.div key={category.name} className="flex items-center mb-2 cursor-pointer" whileHover={{
              scale: 1.05
            }} animate={{
              opacity: selectedCategory === null || selectedCategory === category.name ? 1 : 0.5
            }} onClick={() => handleCategoryClick(category.name)}>
                  <div className="w-3 h-3 rounded-full mr-2" style={{
                backgroundColor: category.color
              }} />
                  <div className="text-sm flex-1">{category.name}</div>
                  <div className="text-sm font-medium">
                    ₦{category.value.toLocaleString()}
                  </div>
                </motion.div>)}
            </div>
          </div>
        </div>
        {/* Timeline Chart */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <h3 className="font-medium text-gray-800 mb-4">Weekly Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData} margin={{
            top: 10,
            right: 0,
            left: -20,
            bottom: 0
          }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis hide={true} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={selectedCategory?.toLowerCase() || 'food'} stackId="a" fill="#f97316" radius={[4, 4, 0, 0]} animationDuration={1000} hide={selectedCategory !== null && selectedCategory !== 'Food'} />
              <Bar dataKey="transport" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} animationDuration={1000} hide={selectedCategory !== null && selectedCategory !== 'Transport'} />
              <Bar dataKey="shopping" stackId="a" fill="#ec4899" radius={[4, 4, 0, 0]} animationDuration={1000} hide={selectedCategory !== null && selectedCategory !== 'Shopping'} />
              <Bar dataKey="bills" stackId="a" fill="#eab308" radius={[4, 4, 0, 0]} animationDuration={1000} hide={selectedCategory !== null && selectedCategory !== 'Bills'} />
              <Bar dataKey="misc" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} animationDuration={1000} hide={selectedCategory !== null && selectedCategory !== 'Misc'} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Spending Insights */}
        <div className="space-y-4 mb-6">
          <h3 className="font-medium text-gray-800">Spending Insights</h3>
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