import React, { useState, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { PlusIcon, MicIcon, ChevronDownIcon, MessageSquareIcon } from 'lucide-react';
import { BudgetRing } from './BudgetRing';
import { InfoTile } from './InfoTile';
import { QuoteDisplay } from './QuoteDisplay';
import { AddTransactionModal } from './AddTransactionModal';
import { BudgetSetup } from './BudgetSetup';
import { Analytics } from './Analytics';
import { Goals } from './Goals';
import { ProfileSettings } from './ProfileSettings';
import { SmartAssistant } from './SmartAssistant';
import { BottomNavigation } from '../Navigation/BottomNavigation';
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
  return <div className="w-full min-h-screen pb-24 relative">
      <motion.div drag="y" dragConstraints={{
      top: 0,
      bottom: 0
    }} dragElastic={0.1} onDragStart={handlePullStart} onDrag={handlePull} onDragEnd={handlePullEnd} animate={controls} className="w-full max-w-md mx-auto">
        {/* Pull to refresh indicator */}
        <motion.div className="flex items-center justify-center h-16 w-full" style={{
        opacity: pullProgress
      }}>
          <ChevronDownIcon className="text-secondary-600 animate-bounce" style={{
          opacity: refreshing ? 0 : 1,
          display: refreshing ? 'none' : 'block'
        }} />
          {refreshing && <div className="flex space-x-2">
              {['₦', '$', '€', '£', '¥'].map((currency, i) => <motion.div key={currency} className="text-lg font-bold text-secondary-600" animate={{
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
          <div className="flex justify-between items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                Hello, Daniella
              </h1>
              <p className="text-gray-600 dark:text-gray-400 font-medium mt-1">Let's manage your money smartly</p>
            </motion.div>
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center cursor-pointer shadow-soft border border-white/20"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05, rotate: 5 }}
              onClick={() => setCurrentScreen('profile')}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="text-white font-bold text-lg">D</span>
            </motion.div>
          </div>
          {/* Smart Assistant Quick Access */}
          <motion.div
            className="relative bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-6 mb-8 shadow-large flex items-center cursor-pointer overflow-hidden"
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentScreen('assistant')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>

            <div className="relative w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mr-4 border border-white/30">
              <MessageSquareIcon className="w-7 h-7 text-white" />
            </div>
            <div className="relative flex-1">
              <h3 className="font-bold font-display text-white text-lg">Budget Buddy</h3>
              <p className="text-white/80 text-sm font-medium">
                Ask me anything about your finances
              </p>
            </div>

            {/* Sparkle effect */}
            <motion.div
              className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          {/* Quote Display */}
          <QuoteDisplay />
          {/* Budget Ring */}
          <div className="mt-6 flex justify-center" onClick={() => setCurrentScreen('analytics')}>
            <BudgetRing percentage={Math.round(budgetData.spent / budgetData.total * 100)} spent={budgetData.spent} total={budgetData.total} currency={budgetData.currency} />
          </div>
          {/* Info Tiles */}
          <motion.div
            className="grid grid-cols-2 gap-4 mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <InfoTile
              title="Today's Spend"
              value={`${budgetData.currency}${budgetData.todaySpend.toLocaleString()}`}
              icon="dollar"
              color="orange"
            />
            <InfoTile
              title="Remaining Budget"
              value={`${budgetData.currency}${budgetData.remainingBudget.toLocaleString()}`}
              icon="wallet"
              color="green"
            />
            <InfoTile
              title="Weekly Progress"
              value={`${budgetData.weeklyProgress}%`}
              icon="trending"
              color="purple"
              className="col-span-2"
            >
              <div className="w-full h-3 bg-gray-100 rounded-full mt-3 overflow-hidden">
                <motion.div
                  className="h-3 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-full shadow-glow"
                  initial={{ width: 0 }}
                  animate={{ width: `${budgetData.weeklyProgress}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.8 }}
                />
              </div>
            </InfoTile>
          </motion.div>
          {/* Quick Actions */}
          <motion.div
            className="grid grid-cols-2 gap-4 mt-8 mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.button
              className="py-6 flex flex-col items-center justify-center text-primary-700 bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl font-medium border border-primary-200 shadow-soft hover:shadow-medium transition-all duration-300"
              onClick={() => setShowModal(true)}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <PlusIcon className="w-8 h-8 mb-3 text-primary-600" />
              <span className="text-sm font-semibold">Add Transaction</span>
            </motion.button>

            <motion.button
              className="py-6 flex flex-col items-center justify-center text-secondary-700 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-3xl font-medium border border-secondary-200 shadow-soft hover:shadow-medium transition-all duration-300"
              onClick={handleVoiceInput}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={voiceActive ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5, repeat: voiceActive ? Infinity : 0 }}
              >
                <MicIcon className={`w-8 h-8 mb-3 ${voiceActive ? 'text-error-500' : 'text-secondary-600'}`} />
              </motion.div>
              <span className="text-sm font-semibold">Voice Input</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
      {/* Bottom Navigation */}
      <BottomNavigation
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
      />

      {/* Transaction Modal */}
      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>;
};