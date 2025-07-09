import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X as XIcon, Calendar as CalendarIcon, FileText as FileTextIcon, Camera as CameraIcon, CheckCircle as CheckCircleIcon, Coffee as CoffeeIcon, ShoppingBag as ShoppingBagIcon, Car as CarIcon, Zap as ZapIcon, Briefcase as BriefcaseIcon, DollarSign as DollarSignIcon, Gift as GiftIcon, TrendingUp as TrendingUpIcon, Clock as ClockIcon, ChevronRight as ChevronRightIcon } from 'lucide-react';
interface AddTransactionModalProps {
  onClose: () => void;
}
interface CategoryOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}
export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  onClose
}) => {
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [displayAmount, setDisplayAmount] = useState('0');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [slideProgress, setSlideProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  // Define category options
  const expenseCategories: CategoryOption[] = [{
    id: 'food',
    name: 'Food',
    icon: <CoffeeIcon size={18} />,
    color: 'bg-orange-100 text-orange-600'
  }, {
    id: 'transport',
    name: 'Transport',
    icon: <CarIcon size={18} />,
    color: 'bg-blue-100 text-blue-600'
  }, {
    id: 'shopping',
    name: 'Shopping',
    icon: <ShoppingBagIcon size={18} />,
    color: 'bg-pink-100 text-pink-600'
  }, {
    id: 'bills',
    name: 'Bills',
    icon: <ZapIcon size={18} />,
    color: 'bg-yellow-100 text-yellow-600'
  }, {
    id: 'misc',
    name: 'Misc',
    icon: <BriefcaseIcon size={18} />,
    color: 'bg-purple-100 text-purple-600'
  }];
  const incomeCategories: CategoryOption[] = [{
    id: 'salary',
    name: 'Salary',
    icon: <DollarSignIcon size={18} />,
    color: 'bg-green-100 text-green-600'
  }, {
    id: 'freelance',
    name: 'Freelance',
    icon: <BriefcaseIcon size={18} />,
    color: 'bg-blue-100 text-blue-600'
  }, {
    id: 'gifts',
    name: 'Gifts',
    icon: <GiftIcon size={18} />,
    color: 'bg-pink-100 text-pink-600'
  }, {
    id: 'investments',
    name: 'Investments',
    icon: <TrendingUpIcon size={18} />,
    color: 'bg-purple-100 text-purple-600'
  }];
  const activeCategories = transactionType === 'expense' ? expenseCategories : incomeCategories;
  // Show suggestion based on time of day
  useEffect(() => {
    const currentHour = new Date().getHours();
    // Show lunch suggestion around noon
    if (currentHour >= 11 && currentHour <= 14) {
      setTimeout(() => {
        setShowSuggestion(true);
      }, 1000);
    }
  }, []);
  // Handle number pad input
  const handleNumberInput = (value: string) => {
    if (value === 'backspace') {
      if (amount.length > 0) {
        const newAmount = amount.slice(0, -1);
        setAmount(newAmount);
        setDisplayAmount(newAmount === '' ? '0' : newAmount);
      }
      return;
    }
    if (value === '.') {
      if (amount.includes('.')) return;
      const newAmount = amount === '' ? '0.' : amount + '.';
      setAmount(newAmount);
      setDisplayAmount(newAmount);
      return;
    }
    const newAmount = amount + value;
    setAmount(newAmount);
    setDisplayAmount(newAmount);
  };
  // Handle suggestion acceptance
  const handleAcceptSuggestion = () => {
    setAmount('2000');
    setDisplayAmount('2000');
    setSelectedCategory('food');
    setShowSuggestion(false);
  };
  // Handle slide to save
  const handleSlideChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSlideProgress(value);
    if (value === 100) {
      handleSave();
    }
  };
  // Save transaction
  const handleSave = () => {
    if (!amount || !selectedCategory) return;
    setShowSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };
  return <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4" initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} exit={{
    opacity: 0
  }}>
      <motion.div className="bg-white w-full max-w-md rounded-2xl overflow-hidden" initial={{
      y: 50,
      opacity: 0
    }} animate={{
      y: 0,
      opacity: 1
    }} transition={{
      type: 'spring',
      damping: 25,
      stiffness: 300
    }}>
        <AnimatePresence>
          {showSuccess ? <motion.div className="flex flex-col items-center justify-center p-10 h-96" initial={{
          opacity: 0,
          scale: 0.8
        }} animate={{
          opacity: 1,
          scale: 1
        }} exit={{
          opacity: 0
        }}>
              <motion.div initial={{
            scale: 0
          }} animate={{
            scale: 1
          }} transition={{
            delay: 0.2,
            type: 'spring'
          }} className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircleIcon className="w-10 h-10 text-green-600" />
              </motion.div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Transaction Saved!
              </h2>
              <p className="text-gray-600 text-center">
                {transactionType === 'expense' ? 'Expense' : 'Income'} of ₦
                {displayAmount} has been added.
              </p>
            </motion.div> : <div>
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-bold">Add Transaction</h2>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100" onClick={onClose}>
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Transaction Type Toggle */}
              <div className="flex rounded-lg bg-gray-100 p-1 mx-4 mt-4">
                <button type="button" className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${transactionType === 'expense' ? 'bg-white shadow-sm text-purple-700' : 'text-gray-600'}`} onClick={() => {
              setTransactionType('expense');
              setSelectedCategory(null);
            }}>
                  Expense
                </button>
                <button type="button" className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${transactionType === 'income' ? 'bg-white shadow-sm text-purple-700' : 'text-gray-600'}`} onClick={() => {
              setTransactionType('income');
              setSelectedCategory(null);
            }}>
                  Income
                </button>
              </div>

              {/* Amount Display */}
              <motion.div className="flex justify-center items-center h-20 mt-4" key={displayAmount} initial={{
            opacity: 0.5,
            y: -10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.2
          }}>
                <span className="text-3xl font-bold mr-1">₦</span>
                <span className="text-5xl font-bold">{displayAmount}</span>
              </motion.div>

              {/* Smart Suggestion */}
              <AnimatePresence>
                {showSuggestion && transactionType === 'expense' && <motion.div className="mx-4 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center" initial={{
              opacity: 0,
              y: -20,
              height: 0
            }} animate={{
              opacity: 1,
              y: 0,
              height: 'auto'
            }} exit={{
              opacity: 0,
              height: 0
            }}>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <ClockIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-blue-800">
                        You've logged lunch at this time before.
                      </p>
                      <p className="text-xs text-blue-600">
                        Add ₦2,000 for Food again?
                      </p>
                    </div>
                    <button className="ml-2 px-3 py-1 bg-blue-600 text-white text-xs rounded-full" onClick={handleAcceptSuggestion}>
                      Yes
                    </button>
                  </motion.div>}
              </AnimatePresence>

              {/* Category Selection */}
              <div className="px-4 mb-4">
                <p className="text-sm text-gray-600 mb-2">Category</p>
                <div className="flex flex-wrap gap-2">
                  {activeCategories.map(category => <motion.button key={category.id} className={`flex items-center px-3 py-2 rounded-full ${selectedCategory === category.id ? 'bg-purple-600 text-white' : category.color}`} whileTap={{
                scale: 0.95
              }} onClick={() => setSelectedCategory(category.id)}>
                      <span className="mr-1">{category.icon}</span>
                      <span className="text-sm">{category.name}</span>
                    </motion.button>)}
                </div>
              </div>

              {/* Additional Details Toggle */}
              <div className="px-4 mb-4">
                <button className="flex items-center justify-between w-full py-2 text-purple-600 text-sm font-medium" onClick={() => setShowDetails(!showDetails)}>
                  <span>
                    {showDetails ? 'Hide' : 'Show'} additional details
                  </span>
                  <ChevronRightIcon className={`w-5 h-5 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
                </button>
              </div>

              {/* Additional Details */}
              <AnimatePresence>
                {showDetails && <motion.div className="px-4 space-y-4" initial={{
              height: 0,
              opacity: 0
            }} animate={{
              height: 'auto',
              opacity: 1
            }} exit={{
              height: 0,
              opacity: 0
            }} transition={{
              duration: 0.3
            }}>
                    {/* Date Picker */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Date & Time
                      </label>
                      <div className="flex items-center border border-gray-300 rounded-lg p-3">
                        <CalendarIcon className="w-5 h-5 text-gray-400 mr-2" />
                        <input type="datetime-local" className="flex-1 outline-none text-sm" value={date.toISOString().slice(0, 16)} onChange={e => setDate(new Date(e.target.value))} />
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Notes
                      </label>
                      <div className="flex items-start border border-gray-300 rounded-lg p-3">
                        <FileTextIcon className="w-5 h-5 text-gray-400 mr-2 mt-1" />
                        <textarea className="flex-1 outline-none text-sm resize-none h-20" placeholder="Add notes here..." value={notes} onChange={e => setNotes(e.target.value)} />
                      </div>
                    </div>

                    {/* Receipt Upload */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Add Receipt
                      </label>
                      <button className="w-full flex items-center justify-center border border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <CameraIcon className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          Take Photo or Upload
                        </span>
                      </button>
                    </div>
                  </motion.div>}
              </AnimatePresence>

              {/* Number Pad */}
              <div className="grid grid-cols-3 gap-1 p-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'backspace'].map(num => <motion.button key={num} className={`h-14 flex items-center justify-center rounded-lg ${num === 'backspace' ? 'text-gray-600' : 'text-gray-800 text-xl font-medium'} ${typeof num === 'number' || num === '.' ? 'bg-gray-100 hover:bg-gray-200' : 'hover:bg-gray-100'}`} whileTap={{
              scale: 0.95
            }} onClick={() => handleNumberInput(num.toString())}>
                    {num === 'backspace' ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 12H8m12 0l-4 4m4-4l-4-4" />
                      </svg> : num}
                  </motion.button>)}
              </div>

              {/* Slide to Save */}
              <div className="px-4 pb-6">
                <div className="relative h-14 bg-gray-100 rounded-full flex items-center px-4">
                  <div className="absolute left-0 top-0 bottom-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" style={{
                width: `${slideProgress}%`
              }} />
                  <div className="absolute left-4 right-4 flex items-center justify-between z-10">
                    <span className={`text-sm font-medium ${slideProgress > 50 ? 'text-white' : 'text-gray-600'}`}>
                      Slide to save
                    </span>
                    <ChevronRightIcon className={`w-5 h-5 ${slideProgress > 50 ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <input type="range" min="0" max="100" value={slideProgress} onChange={handleSlideChange} className="absolute inset-0 opacity-0 cursor-pointer w-full" />
                </div>
              </div>
            </div>}
        </AnimatePresence>
      </motion.div>
    </motion.div>;
};