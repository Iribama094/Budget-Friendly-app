import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, PlusIcon, CheckCircleIcon, LockIcon, UnlockIcon, TrendingUpIcon, CalendarIcon } from 'lucide-react';
interface GoalsProps {
  onBack: () => void;
}
interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  emoji: string;
  image: string;
  isLocked: boolean;
  isCompleted: boolean;
}
export const Goals: React.FC<GoalsProps> = ({
  onBack
}) => {
  const [showCompletedMessage, setShowCompletedMessage] = useState<string | null>(null);
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  // Mock goals data
  const [goals, setGoals] = useState<Goal[]>([{
    id: '1',
    name: 'Travel Fund',
    targetAmount: 250000,
    currentAmount: 250000,
    deadline: '2023-12-15',
    emoji: '✈️',
    image: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    isLocked: true,
    isCompleted: true
  }, {
    id: '2',
    name: 'Home Decor',
    targetAmount: 150000,
    currentAmount: 87500,
    deadline: '2023-11-30',
    emoji: '🛋',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80',
    isLocked: false,
    isCompleted: false
  }, {
    id: '3',
    name: 'New Laptop',
    targetAmount: 450000,
    currentAmount: 125000,
    deadline: '2024-03-01',
    emoji: '💻',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
    isLocked: true,
    isCompleted: false
  }]);
  // Toggle lock status
  const toggleLock = (id: string) => {
    setGoals(goals.map(goal => goal.id === id ? {
      ...goal,
      isLocked: !goal.isLocked
    } : goal));
  };
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  // Calculate days remaining
  const calculateDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  // Handle goal click
  const handleGoalClick = (id: string) => {
    setExpandedGoal(expandedGoal === id ? null : id);
  };
  // Simulate completing a goal
  const completeGoal = (id: string) => {
    const goalToComplete = goals.find(goal => goal.id === id);
    if (goalToComplete) {
      setShowCompletedMessage(goalToComplete.name);
      // Update goal status
      setGoals(goals.map(goal => goal.id === id ? {
        ...goal,
        currentAmount: goal.targetAmount,
        isCompleted: true
      } : goal));
      // Hide message after delay
      setTimeout(() => {
        setShowCompletedMessage(null);
      }, 5000);
    }
  };
  return <div className="w-full min-h-screen py-6 pb-24 relative">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <motion.button
              className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm shadow-soft flex items-center justify-center mr-4 border border-white/20"
              onClick={onBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </motion.button>
            <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              Your Goals
            </h1>
          </div>
          <motion.button
            className="w-12 h-12 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 shadow-large flex items-center justify-center border border-white/20"
            whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)' }}
            whileTap={{ scale: 0.95 }}
          >
            <PlusIcon className="w-5 h-5 text-white" />
          </motion.button>
        </div>
        {/* Completion Message */}
        <AnimatePresence>
          {showCompletedMessage && <motion.div
            className="bg-gradient-to-r from-primary-50 to-success-50 border border-primary-200 rounded-2xl p-4 mb-6 flex items-center shadow-soft backdrop-blur-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
              <CheckCircleIcon className="w-6 h-6 text-primary-600 mr-3" />
              <div>
                <p className="text-primary-800 font-semibold">Goal Completed!</p>
                <p className="text-primary-700 text-sm">
                  Goal completed successfully!
                </p>
              </div>
            </motion.div>}
        </AnimatePresence>
        {/* Goals List */}
        <div className="space-y-6">
          {goals.map(goal => <div key={goal.id}>
              <motion.div
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-soft overflow-hidden cursor-pointer border border-white/20 dark:border-gray-700/20"
                whileHover={{ y: -4, scale: 1.02, boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGoalClick(goal.id)}
              >
                {/* Goal Card */}
                <div className="relative h-32">
                  <img src={goal.image} alt={goal.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold flex items-center">
                          <span className="mr-2">{goal.emoji}</span>
                          {goal.name}
                        </h3>
                        <p className="text-sm text-white/90">
                          {goal.isCompleted ? 'Completed!' : `${calculateDaysRemaining(goal.deadline)} days remaining`}
                        </p>
                      </div>
                      <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center" onClick={e => {
                    e.stopPropagation();
                    toggleLock(goal.id);
                  }}>
                        {goal.isLocked ? <LockIcon className="w-4 h-4 text-white" /> : <UnlockIcon className="w-4 h-4 text-white" />}
                      </button>
                    </div>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-gray-600">
                      {Math.round(goal.currentAmount / goal.targetAmount * 100)}
                      % Complete
                    </div>
                    <div className="text-sm font-medium">
                      ₦{goal.currentAmount.toLocaleString()} / ₦
                      {goal.targetAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 shadow-glow"
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.currentAmount / goal.targetAmount * 100}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </motion.div>
              {/* Expanded View */}
              <AnimatePresence>
                {expandedGoal === goal.id && <motion.div
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mt-2 rounded-2xl p-4 shadow-soft border border-white/20 dark:border-gray-700/20"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Timeline</h4>
                    {/* Goal Timeline */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3 border border-primary-200">
                          <CalendarIcon className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Goal Started</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">May 15, 2023</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center mr-3 border border-secondary-200">
                          <TrendingUpIcon className="w-4 h-4 text-secondary-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Target Date</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(goal.deadline)}
                          </p>
                        </div>
                      </div>
                      {goal.isCompleted && <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center mr-3 border border-accent-200">
                            <CheckCircleIcon className="w-4 h-4 text-accent-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                              Goal Completed
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Today</p>
                          </div>
                        </div>}
                    </div>
                    {/* Action Button */}
                    {!goal.isCompleted && <motion.button
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold shadow-soft"
                      onClick={() => completeGoal(goal.id)}
                      whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                        Add Funds
                      </motion.button>}
                  </motion.div>}
              </AnimatePresence>
            </div>)}
        </div>
      </div>
    </div>;
};