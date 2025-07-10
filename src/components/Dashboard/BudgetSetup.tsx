import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, SparklesIcon, InfoIcon, CheckCircleIcon } from 'lucide-react';
import { loadUserData, saveUserData } from '../../utils/dataManager';
interface BudgetSetupProps {
  onBack: () => void;
}
export const BudgetSetup: React.FC<BudgetSetupProps> = ({
  onBack
}) => {
  const [income, setIncome] = useState(150000);
  const [essentialSpend, setEssentialSpend] = useState(60000);
  const [savingsGoal, setSavingsGoal] = useState(30000);
  const [freeSpend, setFreeSpend] = useState(60000);
  const [isBalanced, setIsBalanced] = useState(false);
  const [showSmartBalance, setShowSmartBalance] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMiniBudgets, setShowMiniBudgets] = useState(false);
  const [miniBudgets, setMiniBudgets] = useState([
    { id: 1, name: 'Weekly Groceries', amount: 15000, category: 'Food', color: 'bg-green-500' },
    { id: 2, name: 'Entertainment', amount: 8000, category: 'Fun', color: 'bg-purple-500' },
    { id: 3, name: 'Gas & Transport', amount: 12000, category: 'Transport', color: 'bg-blue-500' }
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  // Calculate percentages
  const essentialPercent = Math.round(essentialSpend / income * 100) || 0;
  const savingsPercent = Math.round(savingsGoal / income * 100) || 0;
  const freeSpendPercent = Math.round(freeSpend / income * 100) || 0;
  const totalAllocated = essentialSpend + savingsGoal + freeSpend;
  const remainingAmount = income - totalAllocated;
  // Check if budget is balanced
  useEffect(() => {
    const isNowBalanced = Math.abs(remainingAmount) < 100;
    if (isNowBalanced && !isBalanced && income > 0) {
      setIsBalanced(true);
      setShowConfetti(true);
      // Hide success message after delay
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    } else if (!isNowBalanced) {
      setIsBalanced(false);
    }
  }, [remainingAmount, isBalanced, income]);
  // Apply smart balance suggestion
  const applySmartBalance = () => {
    const smartEssential = Math.round(income * 0.5);
    const smartSavings = Math.round(income * 0.2);
    const smartFree = income - smartEssential - smartSavings;
    setEssentialSpend(smartEssential);
    setSavingsGoal(smartSavings);
    setFreeSpend(smartFree);
  };

  // Save budget plan
  const saveBudgetPlan = async () => {
    if (!isBalanced || isSaving) return;

    setIsSaving(true);

    try {
      const userData = loadUserData();

      // Create new budget
      const newBudget = {
        id: Date.now().toString(),
        name: 'Monthly Budget',
        totalBudget: income,
        categories: {
          'Essential': { budgeted: essentialSpend, spent: 0 },
          'Savings': { budgeted: savingsGoal, spent: 0 },
          'Free Spending': { budgeted: freeSpend, spent: 0 }
        },
        period: 'monthly' as const,
        startDate: new Date().toISOString().split('T')[0]
      };

      // Update user data
      userData.budgets = [newBudget, ...userData.budgets.filter(b => b.name !== 'Monthly Budget')];
      userData.monthlyIncome = income;

      saveUserData(userData);

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsSaving(false);
      }, 2000);

    } catch (error) {
      console.error('Error saving budget:', error);
      setIsSaving(false);
    }
  };
  return <div className="w-full min-h-screen py-6 pb-24 relative">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mr-4" onClick={onBack}>
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Budget Setup</h1>
        </div>
        {/* Success Message */}
        <AnimatePresence>
          {showConfetti && <motion.div className="bg-green-100 border border-green-200 rounded-xl p-4 mb-6 flex items-center" initial={{
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
              <p className="text-green-800 font-medium">
                Nice! You're giving every naira a job.
              </p>
            </motion.div>}
        </AnimatePresence>
        {/* Smart Balance Toggle */}
        <div className="flex items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-sm border border-white/20 dark:border-gray-700/20">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <SparklesIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">Smart Balance</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                AI-recommended budget allocation
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={showSmartBalance} onChange={() => {
            setShowSmartBalance(!showSmartBalance);
            if (!showSmartBalance) {
              applySmartBalance();
            }
          }} />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
        {/* Budget Graph */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-sm border border-white/20 dark:border-gray-700/20">
          <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Budget Allocation</h3>
          <div className="h-8 w-full rounded-lg overflow-hidden flex mb-2">
            <motion.div className="bg-blue-500 h-full" animate={{
            width: `${essentialPercent}%`
          }} transition={{
            duration: 0.5
          }} />
            <motion.div className="bg-purple-500 h-full" animate={{
            width: `${savingsPercent}%`
          }} transition={{
            duration: 0.5
          }} />
            <motion.div className="bg-green-500 h-full" animate={{
            width: `${freeSpendPercent}%`
          }} transition={{
            duration: 0.5
          }} />
          </div>
          <div className="flex text-xs justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
              <span>Essential</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
              <span>Savings</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
              <span>Free Spend</span>
            </div>
          </div>
        </div>
        {/* Income Input */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 mb-4 shadow-sm border border-white/20 dark:border-gray-700/20">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-800 dark:text-gray-200">Monthly Income</h3>
            <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
              ₦{income.toLocaleString()}
            </div>
          </div>
          <input type="range" min="10000" max="2000000" step="5000" value={income} onChange={e => setIncome(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
        </div>
        {/* Budget Category Cards */}
        <div className="space-y-4">
          {/* Essential Spending */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border-l-4 border-blue-500 border border-white/20 dark:border-gray-700/20">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  Essential Spending
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Rent, utilities, groceries
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  ₦{essentialSpend.toLocaleString()}
                </div>
                <div className="text-xs text-blue-600">
                  {essentialPercent}% of income
                </div>
              </div>
            </div>
            <input type="range" min="0" max={income} value={essentialSpend} onChange={e => setEssentialSpend(parseInt(e.target.value))} className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          {/* Savings Goal */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border-l-4 border-purple-500 border border-white/20 dark:border-gray-700/20">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Savings Goal</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Future investments</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  ₦{savingsGoal.toLocaleString()}
                </div>
                <div className="text-xs text-purple-600">
                  {savingsPercent}% of income
                </div>
              </div>
            </div>
            <input type="range" min="0" max={income} value={savingsGoal} onChange={e => setSavingsGoal(parseInt(e.target.value))} className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>20%</span>
              <span>100%</span>
            </div>
          </div>
          {/* Free Spending */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border-l-4 border-green-500 border border-white/20 dark:border-gray-700/20">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Free Spending</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Entertainment, dining out
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  ₦{freeSpend.toLocaleString()}
                </div>
                <div className="text-xs text-green-600">
                  {freeSpendPercent}% of income
                </div>
              </div>
            </div>
            <input type="range" min="0" max={income} value={freeSpend} onChange={e => setFreeSpend(parseInt(e.target.value))} className="w-full h-2 bg-green-100 rounded-lg appearance-none cursor-pointer" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>30%</span>
              <span>100%</span>
            </div>
          </div>
          {/* Remaining Balance */}
          <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20 dark:border-gray-700/20 ${remainingAmount === 0 ? 'border-l-4 border-green-500' : remainingAmount > 0 ? 'border-l-4 border-blue-500' : 'border-l-4 border-red-500'}`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Remaining Balance</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {remainingAmount === 0 ? 'Perfectly balanced!' : remainingAmount > 0 ? 'Still unallocated' : 'Overbudget!'}
                </p>
              </div>
              <div className={`text-lg font-bold ${remainingAmount === 0 ? 'text-green-600' : remainingAmount > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                ₦{Math.abs(remainingAmount).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
        {/* Save Button */}
        {/* Mini Budgets Section */}
        <motion.div
          className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Mini Budgets</h3>
            <button
              className="text-primary-600 text-sm font-medium hover:text-primary-700 transition-colors"
              onClick={() => setShowMiniBudgets(!showMiniBudgets)}
            >
              {showMiniBudgets ? 'Hide' : 'Manage'}
            </button>
          </div>

          <p className="text-gray-600 text-sm mb-4">
            Create specific budgets for different spending categories to stay on track.
          </p>

          <AnimatePresence>
            {showMiniBudgets && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                {miniBudgets.map((budget, index) => (
                  <motion.div
                    key={budget.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${budget.color}`}></div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{budget.name}</p>
                        <p className="text-xs text-gray-500">{budget.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">₦{budget.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">per month</p>
                    </div>
                  </motion.div>
                ))}

                <motion.button
                  className="w-full py-3 border-2 border-dashed border-primary-300 rounded-xl text-primary-600 font-medium hover:bg-primary-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  + Add Mini Budget
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.button
          className={`w-full py-4 rounded-2xl mt-8 font-semibold text-white shadow-large ${
            isBalanced && !isSaving
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:shadow-glow'
              : 'bg-gray-400'
          }`}
          whileTap={{ scale: 0.98 }}
          whileHover={isBalanced && !isSaving ? { scale: 1.02 } : {}}
          disabled={!isBalanced || isSaving}
          onClick={saveBudgetPlan}
        >
          {isSaving ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving Budget...
            </div>
          ) : saveSuccess ? (
            <div className="flex items-center justify-center gap-2">
              <CheckCircleIcon className="w-5 h-5" />
              Budget Saved!
            </div>
          ) : (
            'Save Budget Plan'
          )}
        </motion.button>

        {/* Success Message */}
        {saveSuccess && (
          <motion.div
            className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircleIcon className="w-5 h-5" />
              <span className="font-medium">Budget plan saved successfully!</span>
            </div>
            <p className="text-green-600 text-sm mt-1">
              Your budget is now active and tracking your spending.
            </p>
          </motion.div>
        )}
      </div>
    </div>;
};