import React, { useState, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { PlusIcon, MicIcon, ChevronDownIcon, BarChart3Icon, PieChartIcon, TargetIcon, UserIcon, MessageSquareIcon } from 'lucide-react';
import { BudgetRing } from './BudgetRing';
import { InfoTile } from './InfoTile';
import { QuoteDisplay } from './QuoteDisplay';
import { AddTransactionModal } from './AddTransactionModal';
import { BudgetSetup } from './BudgetSetup';
import { Analytics } from './Analytics';
import { Goals } from './Goals';
import { ProfileSettings } from './ProfileSettings';
import { SmartAssistant } from './SmartAssistant';
export const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'budget' | 'analytics' | 'goals' | 'profile' | 'assistant'>('dashboard');
  // Mock data
  const budgetData = {
    spent: 75000,
    total: 120000,
    todaySpend: 3500,
    remainingBudget: 45000,
    weeklyProgress: 62,
    currency: '₦'
  };
  // Pull to refresh functionality
  const y = useMotionValue(0);
  const controls = useAnimation();
  const pullThreshold = 100;
  const pullProgress = useTransform(y, [0, pullThreshold], [0, 1]);
  const handlePullStart = () => {
    controls.stop();
  };
  const handlePull = (_, info) => {
    if (info.offset.y > 0) {
      y.set(info.offset.y);
    } else {
      y.set(0);
    }
  };
  const handlePullEnd = async () => {
    if (y.get() > pullThreshold) {
      setRefreshing(true);
      controls.start({
        y: 50,
        transition: {
          duration: 0.2
        }
      });
      // Simulate refresh
      setTimeout(() => {
        setRefreshing(false);
        controls.start({
          y: 0,
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30
          }
        });
        y.set(0);
      }, 2000);
    } else {
      controls.start({
        y: 0,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 30
        }
      });
      y.set(0);
    }
  };
  const handleVoiceInput = () => {
    setVoiceActive(true);
    // In a real app, this would activate speech recognition
    setTimeout(() => {
      setVoiceActive(false);
      // Mock adding a transaction
      alert('Transaction added: ₦2,500 for lunch');
    }, 3000);
  };
  // Navigate back to dashboard
  const navigateToDashboard = () => {
    setCurrentScreen('dashboard');
  };
  // Render different screens
  if (currentScreen === 'budget') {
    return <BudgetSetup onBack={navigateToDashboard} />;
  }
  if (currentScreen === 'analytics') {
    return <Analytics onBack={navigateToDashboard} />;
  }
  if (currentScreen === 'goals') {
    return <Goals onBack={navigateToDashboard} />;
  }
  if (currentScreen === 'profile') {
    return <ProfileSettings onBack={navigateToDashboard} />;
  }
  if (currentScreen === 'assistant') {
    return <SmartAssistant onBack={navigateToDashboard} />;
  }
  return <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-20">
      <motion.div drag="y" dragConstraints={{
      top: 0,
      bottom: 0
    }} dragElastic={0.1} onDragStart={handlePullStart} onDrag={handlePull} onDragEnd={handlePullEnd} animate={controls} className="w-full max-w-md mx-auto">
        {/* Pull to refresh indicator */}
        <motion.div className="flex items-center justify-center h-16 w-full" style={{
        opacity: pullProgress
      }}>
          <ChevronDownIcon className="text-purple-600 animate-bounce" style={{
          opacity: refreshing ? 0 : 1,
          display: refreshing ? 'none' : 'block'
        }} />
          {refreshing && <div className="flex space-x-2">
              {['₦', '$', '€', '£', '¥'].map((currency, i) => <motion.div key={currency} className="text-lg font-bold text-purple-600" animate={{
            y: [0, -10, 0],
            opacity: [0.4, 1, 0.4]
          }} transition={{
            duration: 1,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: i * 0.1
          }}>
                  {currency}
                </motion.div>)}
            </div>}
        </motion.div>
        <div className="px-6 pt-4 pb-20">
          {/* Header with user greeting */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Hello, Sam</h1>
              <p className="text-gray-600">Let's manage your money</p>
            </div>
            <motion.div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center cursor-pointer" whileTap={{
            scale: 0.95
          }} onClick={() => setCurrentScreen('profile')}>
              <span className="text-purple-700 font-medium">S</span>
            </motion.div>
          </div>
          {/* Smart Assistant Quick Access */}
          <motion.div className="bg-white rounded-xl p-4 mb-6 shadow-sm flex items-center cursor-pointer" whileHover={{
          y: -2
        }} whileTap={{
          scale: 0.98
        }} onClick={() => setCurrentScreen('assistant')}>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
              <MessageSquareIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">Smart Assistant</h3>
              <p className="text-sm text-gray-600">
                Ask me anything about your finances
              </p>
            </div>
          </motion.div>
          {/* Quote Display */}
          <QuoteDisplay />
          {/* Budget Ring */}
          <div className="mt-6 flex justify-center" onClick={() => setCurrentScreen('analytics')}>
            <BudgetRing percentage={Math.round(budgetData.spent / budgetData.total * 100)} spent={budgetData.spent} total={budgetData.total} currency={budgetData.currency} />
          </div>
          {/* Info Tiles */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <InfoTile title="Today's Spend" value={`${budgetData.currency}${budgetData.todaySpend.toLocaleString()}`} icon="calendar" color="blue" />
            <InfoTile title="Remaining Budget" value={`${budgetData.currency}${budgetData.remainingBudget.toLocaleString()}`} icon="wallet" color="green" />
            <InfoTile title="Weekly Progress" value={`${budgetData.weeklyProgress}%`} icon="chart" color="purple" className="col-span-2">
              <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                <motion.div className="h-2 bg-purple-600 rounded-full" initial={{
                width: 0
              }} animate={{
                width: `${budgetData.weeklyProgress}%`
              }} transition={{
                duration: 1,
                ease: 'easeOut'
              }} />
              </div>
            </InfoTile>
          </div>
          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <button className="py-3 flex flex-col items-center justify-center text-purple-700 bg-purple-100 rounded-xl font-medium" onClick={() => setCurrentScreen('budget')}>
              <BarChart3Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">Budget</span>
            </button>
            <button className="py-3 flex flex-col items-center justify-center text-blue-700 bg-blue-100 rounded-xl font-medium" onClick={() => setCurrentScreen('analytics')}>
              <PieChartIcon className="w-5 h-5 mb-1" />
              <span className="text-xs">Analytics</span>
            </button>
            <button className="py-3 flex flex-col items-center justify-center text-green-700 bg-green-100 rounded-xl font-medium" onClick={() => setCurrentScreen('goals')}>
              <TargetIcon className="w-5 h-5 mb-1" />
              <span className="text-xs">Goals</span>
            </button>
          </div>
        </div>
      </motion.div>
      {/* Add Transaction Button */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center items-center space-x-4">
        <motion.button className="flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg border-2 border-purple-200" whileTap={{
        scale: 0.9
      }} onClick={handleVoiceInput}>
          <MicIcon className={`w-6 h-6 ${voiceActive ? 'text-red-500 animate-pulse' : 'text-purple-600'}`} />
        </motion.button>
        <motion.button className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg text-white" whileTap={{
        scale: 0.9
      }} onClick={() => setShowModal(true)}>
          <PlusIcon className="w-8 h-8" />
        </motion.button>
      </div>
      {/* Transaction Modal */}
      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>;
};