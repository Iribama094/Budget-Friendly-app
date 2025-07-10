// Data Management System with localStorage persistence

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  timestamp: number;
}

export interface Budget {
  id: string;
  name: string;
  totalBudget: number;
  categories: {
    [key: string]: {
      budgeted: number;
      spent: number;
    };
  };
  period: 'monthly' | 'weekly';
  startDate: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  emoji: string;
  color: string;
  category: string;
}

export interface UserData {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
  monthlyIncome: number;
  lastUpdated: string;
}

// Default data structure
const defaultData: UserData = {
  transactions: [],
  budgets: [],
  goals: [
    {
      id: '1',
      name: 'Emergency Fund',
      targetAmount: 100000,
      currentAmount: 45000,
      targetDate: '2024-12-31',
      emoji: '',
      color: 'bg-gradient-to-br from-orange-400 to-red-500',
      category: 'Safety'
    },
    {
      id: '2',
      name: 'Vacation',
      targetAmount: 80000,
      currentAmount: 25000,
      targetDate: '2024-08-15',
      emoji: '',
      color: 'bg-gradient-to-br from-blue-400 to-purple-500',
      category: 'Travel'
    },
    {
      id: '3',
      name: 'New Laptop',
      targetAmount: 150000,
      currentAmount: 60000,
      targetDate: '2024-10-01',
      emoji: '',
      color: 'bg-gradient-to-br from-purple-400 to-pink-500',
      category: 'Technology'
    }
  ],
  totalIncome: 0,
  totalExpenses: 0,
  currentBalance: 0,
  monthlyIncome: 150000,
  lastUpdated: new Date().toISOString()
};

// Storage keys
const STORAGE_KEY = 'budgetFriendlyData';

// Load data from localStorage
export const loadUserData = (): UserData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return { ...defaultData, ...data };
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
  return defaultData;
};

// Save data to localStorage
export const saveUserData = (data: UserData): void => {
  try {
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

// Add a new transaction
export const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>): Transaction => {
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString(),
    timestamp: Date.now()
  };

  const userData = loadUserData();
  userData.transactions.unshift(newTransaction); // Add to beginning for recent first

  // Update totals
  if (newTransaction.type === 'income') {
    userData.totalIncome += newTransaction.amount;
  } else {
    userData.totalExpenses += newTransaction.amount;
  }
  userData.currentBalance = userData.totalIncome - userData.totalExpenses;

  saveUserData(userData);
  return newTransaction;
};

// Get transactions for current month
export const getCurrentMonthTransactions = (): Transaction[] => {
  const userData = loadUserData();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return userData.transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });
};

// Get spending by category for current month
export const getSpendingByCategory = (): { [key: string]: number } => {
  const monthlyTransactions = getCurrentMonthTransactions();
  const expenses = monthlyTransactions.filter(t => t.type === 'expense');
  
  const categorySpending: { [key: string]: number } = {};
  expenses.forEach(expense => {
    categorySpending[expense.category] = (categorySpending[expense.category] || 0) + expense.amount;
  });

  return categorySpending;
};

// Calculate financial summary
export const getFinancialSummary = () => {
  const userData = loadUserData();
  const monthlyTransactions = getCurrentMonthTransactions();
  
  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const todayTransactions = monthlyTransactions.filter(t => {
    const today = new Date().toDateString();
    const transactionDate = new Date(t.date).toDateString();
    return today === transactionDate;
  });

  const todaySpending = todayTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const weekTransactions = monthlyTransactions.filter(t => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(t.date) >= weekAgo;
  });

  const weeklySpending = weekTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalBalance: userData.currentBalance,
    monthlyIncome,
    monthlyExpenses,
    monthlyBudget: userData.monthlyIncome,
    todaySpending,
    weeklySpending,
    remainingBudget: userData.monthlyIncome - monthlyExpenses,
    spendingByCategory: getSpendingByCategory()
  };
};

// Validation functions
export const validateAmount = (amount: string): { isValid: boolean; error?: string } => {
  if (!amount || amount.trim() === '') {
    return { isValid: false, error: 'Amount is required' };
  }

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) {
    return { isValid: false, error: 'Please enter a valid number' };
  }

  if (numAmount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }

  if (numAmount > 10000000) {
    return { isValid: false, error: 'Amount is too large' };
  }

  return { isValid: true };
};

export const validateDescription = (description: string): { isValid: boolean; error?: string } => {
  if (!description || description.trim() === '') {
    return { isValid: false, error: 'Description is required' };
  }

  if (description.length < 2) {
    return { isValid: false, error: 'Description must be at least 2 characters' };
  }

  if (description.length > 100) {
    return { isValid: false, error: 'Description must be less than 100 characters' };
  }

  return { isValid: true };
};

export const validateCategory = (category: string): { isValid: boolean; error?: string } => {
  if (!category || category.trim() === '') {
    return { isValid: false, error: 'Please select a category' };
  }

  return { isValid: true };
};
