import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, SparklesIcon, InfoIcon, CheckCircleIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
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
      // Trigger confetti
      const end = Date.now() + 3000;
      const runConfetti = () => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: {
            y: 0.6
          },
          colors: ['#3b82f6', '#8b5cf6', '#10b981']
        });
        if (Date.now() < end) {
          requestAnimationFrame(runConfetti);
        }
      };
      runConfetti();
      // Hide confetti message after delay
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
  return <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-6">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mr-4" onClick={onBack}>
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Budget Setup</h1>
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
        <div className="flex items-center justify-between bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <SparklesIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Smart Balance</h3>
              <p className="text-xs text-gray-500">
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
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <h3 className="font-medium text-gray-800 mb-3">Budget Allocation</h3>
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
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-800">Monthly Income</h3>
            <div className="text-lg font-bold text-gray-800">
              ₦{income.toLocaleString()}
            </div>
          </div>
          <input type="range" min="10000" max="500000" step="1000" value={income} onChange={e => setIncome(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
        </div>
        {/* Budget Category Cards */}
        <div className="space-y-4">
          {/* Essential Spending */}
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-medium text-gray-800">
                  Essential Spending
                </h3>
                <p className="text-xs text-gray-500">
                  Rent, utilities, groceries
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800">
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
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-medium text-gray-800">Savings Goal</h3>
                <p className="text-xs text-gray-500">Future investments</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800">
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
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-medium text-gray-800">Free Spending</h3>
                <p className="text-xs text-gray-500">
                  Entertainment, dining out
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800">
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
          <div className={`bg-white rounded-xl p-4 shadow-sm ${remainingAmount === 0 ? 'border-l-4 border-green-500' : remainingAmount > 0 ? 'border-l-4 border-blue-500' : 'border-l-4 border-red-500'}`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-800">Remaining Balance</h3>
                <p className="text-xs text-gray-500">
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
        <motion.button className={`w-full py-4 rounded-xl mt-8 font-medium text-white ${isBalanced ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-400'}`} whileTap={{
        scale: 0.98
      }} disabled={!isBalanced}>
          Save Budget Plan
        </motion.button>
      </div>
    </div>;
};