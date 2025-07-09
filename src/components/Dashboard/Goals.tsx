import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, PlusIcon, CheckCircleIcon, LockIcon, UnlockIcon, TrendingUpIcon, CalendarIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
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
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: {
          y: 0.6
        },
        colors: ['#3b82f6', '#8b5cf6', '#10b981']
      });
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
  return <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-6">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mr-4" onClick={onBack}>
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Your Goals</h1>
          </div>
          <button className="w-10 h-10 rounded-full bg-purple-600 shadow-sm flex items-center justify-center">
            <PlusIcon className="w-5 h-5 text-white" />
          </button>
        </div>
        {/* Completion Message */}
        <AnimatePresence>
          {showCompletedMessage && <motion.div className="bg-green-100 border border-green-200 rounded-xl p-4 mb-6 flex items-center" initial={{
          opacity: 0,
          y: -20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -20
        }}>
              <CheckCircleIcon className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <p className="text-green-800 font-medium">You did it!</p>
                <p className="text-green-700 text-sm">
                  Time to book that flight.
                </p>
              </div>
            </motion.div>}
        </AnimatePresence>
        {/* Goals List */}
        <div className="space-y-6">
          {goals.map(goal => <div key={goal.id}>
              <motion.div className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer" whileHover={{
            y: -2
          }} onClick={() => handleGoalClick(goal.id)}>
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
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-blue-500 to-purple-600" initial={{
                  width: 0
                }} animate={{
                  width: `${goal.currentAmount / goal.targetAmount * 100}%`
                }} transition={{
                  duration: 1,
                  ease: 'easeOut'
                }} />
                  </div>
                </div>
              </motion.div>
              {/* Expanded View */}
              <AnimatePresence>
                {expandedGoal === goal.id && <motion.div className="bg-white mt-2 rounded-xl p-4 shadow-sm" initial={{
              opacity: 0,
              height: 0
            }} animate={{
              opacity: 1,
              height: 'auto'
            }} exit={{
              opacity: 0,
              height: 0
            }} transition={{
              duration: 0.3
            }}>
                    <h4 className="font-medium text-gray-800 mb-3">Timeline</h4>
                    {/* Goal Timeline */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <CalendarIcon className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Goal Started</p>
                          <p className="text-xs text-gray-500">May 15, 2023</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <TrendingUpIcon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Target Date</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(goal.deadline)}
                          </p>
                        </div>
                      </div>
                      {goal.isCompleted && <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                            <CheckCircleIcon className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Goal Completed
                            </p>
                            <p className="text-xs text-gray-500">Today</p>
                          </div>
                        </div>}
                    </div>
                    {/* Action Button */}
                    {!goal.isCompleted && <button className="w-full py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium" onClick={() => completeGoal(goal.id)}>
                        Add Funds
                      </button>}
                  </motion.div>}
              </AnimatePresence>
            </div>)}
        </div>
      </div>
    </div>;
};