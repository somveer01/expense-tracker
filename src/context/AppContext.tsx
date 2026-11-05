import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  BankAccount, 
  MoneyLent, 
  DebtLoan, 
  MonthlyBudgetDeclaration, 
  BudgetCategory, 
  DailyExpense,
  SurvivalAnalysis 
} from '../types';
import { useAuth } from './AuthContext';

interface AppContextType {
  // Accounts
  accounts: BankAccount[];
  addAccount: (acc: Omit<BankAccount, 'id' | 'updatedAt'>) => void;
  updateAccount: (id: string, acc: Partial<BankAccount>) => void;
  deleteAccount: (id: string) => void;

  // Money Lent (Receivables)
  moneyLent: MoneyLent[];
  addMoneyLent: (item: Omit<MoneyLent, 'id' | 'remainingAmount' | 'status'>) => void;
  recordLentRepayment: (id: string, amount: number) => void;
  updateMoneyLent: (id: string, item: Partial<MoneyLent>) => void;
  deleteMoneyLent: (id: string) => void;

  // Debts & Loans (Payables)
  debts: DebtLoan[];
  addDebt: (item: Omit<DebtLoan, 'id' | 'remainingAmount' | 'status'>) => void;
  recordDebtPayment: (id: string, amount: number) => void;
  updateDebt: (id: string, item: Partial<DebtLoan>) => void;
  deleteDebt: (id: string) => void;

  // Monthly Budget Declarations
  selectedMonth: string; // YYYY-MM
  setSelectedMonth: (month: string) => void;
  getBudgetForMonth: (monthKey: string) => MonthlyBudgetDeclaration;
  saveMonthBudget: (monthKey: string, categories: BudgetCategory[]) => void;
  copyBudgetFromPreviousMonth: (targetMonthKey: string) => void;
  renameCategory: (categoryId: string, newName: string) => void;

  // Daily Expenses
  dailyExpenses: DailyExpense[];
  addDailyExpense: (exp: Omit<DailyExpense, 'id' | 'createdAt'>, deductFromAccount?: boolean) => void;
  updateDailyExpense: (id: string, exp: Partial<DailyExpense>, adjustAccountBalance?: boolean) => void;
  deleteDailyExpense: (id: string, refundToAccount?: boolean) => void;

  // Computed Survival Analysis
  survivalAnalysis: SurvivalAnalysis;

  // Reset / Sample Data
  resetToSampleData: () => void;
  clearAllData: () => void;

  // Global Toast Messages
  toast: { msg: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;

  // 100% Offline Backup & Restore
  exportBackupJSON: () => void;
  importBackupJSON: (jsonString: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const DEFAULT_BUDGET_CATEGORIES: BudgetCategory[] = [
  { id: 'cat-home-emi', name: 'Home For EMI', budgetedAmount: 15000, isEssential: true, icon: 'Home' },
  { id: 'cat-fees-shivansh', name: 'Fees Shivansh', budgetedAmount: 5000, isEssential: true, icon: 'GraduationCap' },
  { id: 'cat-lic', name: 'Lic', budgetedAmount: 3000, isEssential: true, icon: 'ShieldCheck' },
  { id: 'cat-recharge', name: 'Recharge', budgetedAmount: 899, isEssential: true, icon: 'Smartphone' },
  { id: 'cat-food', name: 'Food', budgetedAmount: 8000, isEssential: true, icon: 'ShoppingBag' },
  { id: 'cat-water-bill', name: 'water bill', budgetedAmount: 400, isEssential: true, icon: 'Droplets' },
  { id: 'cat-electriccity', name: 'Electriccity', budgetedAmount: 2000, isEssential: true, icon: 'Zap' },
  { id: 'cat-gas', name: 'Gas', budgetedAmount: 1000, isEssential: true, icon: 'Flame' },
  { id: 'cat-medical', name: 'Medical', budgetedAmount: 1500, isEssential: true, icon: 'HeartPulse' },
  { id: 'cat-milk', name: 'Milk', budgetedAmount: 2000, isEssential: true, icon: 'Coffee' },
  { id: 'cat-mantitance', name: 'Mantitance', budgetedAmount: 1500, isEssential: true, icon: 'Wrench' },
  { id: 'cat-traval', name: 'Traval', budgetedAmount: 2500, isEssential: false, icon: 'Car' },
  { id: 'cat-wifi', name: 'Wifi', budgetedAmount: 999, isEssential: true, icon: 'Wifi' },
];

const getCurrentMonthKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const getSampleAccounts = (): BankAccount[] => [
  { id: 'acc-1', bankName: 'PNB (Savings Account)', accountType: 'savings', accountNumberLast4: '4589', balance: 65000, color: 'border-yellow-500', updatedAt: new Date().toISOString() },
  { id: 'acc-2', bankName: 'HDFC Bank (Salary Account)', accountType: 'salary', accountNumberLast4: '1024', balance: 145000, color: 'border-blue-500', updatedAt: new Date().toISOString() },
  { id: 'acc-3', bankName: 'Cash in Hand (Liquid Reserve)', accountType: 'cash', balance: 18000, color: 'border-emerald-500', updatedAt: new Date().toISOString() },
];

const getSampleMoneyLent = (): MoneyLent[] => [
  {
    id: 'lent-1',
    borrowerName: 'Ramesh (College Friend)',
    totalAmount: 25000,
    amountReceived: 10000,
    remainingAmount: 15000,
    lentDate: '2026-08-15',
    expectedReturnDate: '2026-11-20',
    phone: '9876543210',
    notes: 'Lent for emergency medical expenses, promised to return in November',
    status: 'partially_settled'
  },
  {
    id: 'lent-2',
    borrowerName: 'Sunil Sharma (Former Colleague)',
    totalAmount: 8000,
    amountReceived: 0,
    remainingAmount: 8000,
    lentDate: '2026-09-02',
    expectedReturnDate: '2026-11-30',
    notes: 'Laptop repair loan',
    status: 'active'
  }
];

const getSampleDebts = (): DebtLoan[] => [
  {
    id: 'debt-1',
    lenderName: 'HDFC Two-Wheeler / Bike Loan',
    type: 'car_bike_loan',
    totalAmount: 75000,
    amountRepaid: 45000,
    remainingAmount: 30000,
    monthlyEMI: 3500,
    dueDay: 5,
    notes: 'EMI deducted on 5th of every month',
    status: 'active'
  },
  {
    id: 'debt-2',
    lenderName: 'Uncle / Family Loan',
    type: 'borrowed_friend_family',
    totalAmount: 20000,
    amountRepaid: 5000,
    remainingAmount: 15000,
    dueDay: 1,
    notes: 'To be repaid as soon as new job offer arrives',
    status: 'active'
  }
];

const getSampleExpenses = (): DailyExpense[] => [
  {
    id: 'exp-1',
    date: new Date().toISOString().split('T')[0],
    categoryId: 'cat-food',
    categoryName: 'Food',
    amount: 1450,
    title: 'Vegetables, Grains & Flour',
    bankAccountId: 'acc-2',
    createdAt: new Date().toISOString()
  },
  {
    id: 'exp-2',
    date: new Date().toISOString().split('T')[0],
    categoryId: 'cat-gas',
    categoryName: 'Gas',
    amount: 980,
    title: 'Indane LPG Refill',
    bankAccountId: 'acc-1',
    createdAt: new Date().toISOString()
  },
  {
    id: 'exp-3',
    date: new Date().toISOString().split('T')[0],
    categoryId: 'cat-recharge',
    categoryName: 'Recharge',
    amount: 349,
    title: 'Jio 28-Day Data Plan',
    bankAccountId: 'acc-2',
    createdAt: new Date().toISOString()
  }
];

// Helper to retrieve saved data across legacy prefixes
const getStoredItem = <T,>(key: string, fallback: T): T => {
  try {
    const val = localStorage.getItem(`surviva_${key}`) || 
                localStorage.getItem(`surviva_guest_${key}`) || 
                localStorage.getItem(`surviva_app_${key}`);
    if (val) {
      return JSON.parse(val);
    }
  } catch (err) {
    console.warn(`Error reading localStorage for ${key}:`, err);
  }
  return fallback;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonthKey());
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Unified State with persistent offline storage
  const [accounts, setAccounts] = useState<BankAccount[]>(() => {
    return getStoredItem('accounts', getSampleAccounts());
  });

  const [moneyLent, setMoneyLent] = useState<MoneyLent[]>(() => {
    return getStoredItem('money_lent', getSampleMoneyLent());
  });

  const [debts, setDebts] = useState<DebtLoan[]>(() => {
    return getStoredItem('debts', getSampleDebts());
  });

  const [monthlyBudgets, setMonthlyBudgets] = useState<Record<string, MonthlyBudgetDeclaration>>(() => {
    const defaultBudgets = () => {
      const currKey = getCurrentMonthKey();
      const sum = DEFAULT_BUDGET_CATEGORIES.reduce((acc, c) => acc + c.budgetedAmount, 0);
      return {
        [currKey]: {
          id: `budget-${currKey}`,
          monthYear: currKey,
          categories: DEFAULT_BUDGET_CATEGORIES,
          totalBudgeted: sum,
          updatedAt: new Date().toISOString()
        }
      };
    };
    const stored = getStoredItem<Record<string, MonthlyBudgetDeclaration>>('budgets', defaultBudgets());
    const currKey = getCurrentMonthKey();
    if (stored[currKey] && stored[currKey].categories.some(c => c.id === 'cat-rent' || c.name === 'House / Apartment Rent')) {
      const sum = DEFAULT_BUDGET_CATEGORIES.reduce((acc, c) => acc + c.budgetedAmount, 0);
      stored[currKey] = {
        ...stored[currKey],
        categories: DEFAULT_BUDGET_CATEGORIES,
        totalBudgeted: sum,
        updatedAt: new Date().toISOString()
      };
    }
    return stored;
  });

  const [dailyExpenses, setDailyExpenses] = useState<DailyExpense[]>(() => {
    const stored = getStoredItem<DailyExpense[]>('expenses', getSampleExpenses());
    return stored.map(e => {
      if (e.categoryId === 'cat-grocery') {
        return { ...e, categoryId: 'cat-food', categoryName: 'Food' };
      }
      return e;
    });
  });

  // Local Storage persistence - Guaranteed to save reliably on every change
  useEffect(() => {
    try {
      localStorage.setItem('surviva_accounts', JSON.stringify(accounts));
    } catch (e) {
      console.error('Failed to save accounts to localStorage:', e);
    }
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem('surviva_money_lent', JSON.stringify(moneyLent));
    } catch (e) {
      console.error('Failed to save money_lent to localStorage:', e);
    }
  }, [moneyLent]);

  useEffect(() => {
    try {
      localStorage.setItem('surviva_debts', JSON.stringify(debts));
    } catch (e) {
      console.error('Failed to save debts to localStorage:', e);
    }
  }, [debts]);

  useEffect(() => {
    try {
      localStorage.setItem('surviva_budgets', JSON.stringify(monthlyBudgets));
    } catch (e) {
      console.error('Failed to save budgets to localStorage:', e);
    }
  }, [monthlyBudgets]);

  useEffect(() => {
    try {
      localStorage.setItem('surviva_expenses', JSON.stringify(dailyExpenses));
    } catch (e) {
      console.error('Failed to save expenses to localStorage:', e);
    }
  }, [dailyExpenses]);

  // Accounts Operations
  const addAccount = (acc: Omit<BankAccount, 'id' | 'updatedAt'>) => {
    const newAcc: BankAccount = {
      ...acc,
      id: 'acc-' + Date.now(),
      updatedAt: new Date().toISOString()
    };
    setAccounts(prev => [...prev, newAcc]);
    showToast(`Bank account "${acc.bankName}" added successfully!`);
  };

  const updateAccount = (id: string, updated: Partial<BankAccount>) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, ...updated, updatedAt: new Date().toISOString() } : a));
    showToast(`Account updated successfully!`);
  };

  const deleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
    showToast(`Account removed.`);
  };

  // Money Lent Operations
  const addMoneyLent = (item: Omit<MoneyLent, 'id' | 'remainingAmount' | 'status'>) => {
    const remaining = Math.max(0, item.totalAmount - (item.amountReceived || 0));
    const status = remaining === 0 ? 'fully_settled' : item.amountReceived > 0 ? 'partially_settled' : 'active';
    const newItem: MoneyLent = {
      ...item,
      id: 'lent-' + Date.now(),
      remainingAmount: remaining,
      status
    };
    setMoneyLent(prev => [newItem, ...prev]);
    showToast(`Money lent to "${item.borrowerName}" recorded!`);
  };

  const recordLentRepayment = (id: string, amount: number) => {
    setMoneyLent(prev => prev.map(item => {
      if (item.id !== id) return item;
      const newReceived = item.amountReceived + amount;
      const newRemaining = Math.max(0, item.totalAmount - newReceived);
      const newStatus = newRemaining === 0 ? 'fully_settled' : 'partially_settled';
      return {
        ...item,
        amountReceived: newReceived,
        remainingAmount: newRemaining,
        status: newStatus
      };
    }));
    showToast(`Repayment of ₹${amount.toLocaleString('en-IN')} recorded!`);
  };

  const updateMoneyLent = (id: string, item: Partial<MoneyLent>) => {
    setMoneyLent(prev => prev.map(m => {
      if (m.id !== id) return m;
      const total = item.totalAmount !== undefined ? item.totalAmount : m.totalAmount;
      const received = item.amountReceived !== undefined ? item.amountReceived : m.amountReceived;
      const remaining = Math.max(0, total - received);
      const status = remaining === 0 ? 'fully_settled' : received > 0 ? 'partially_settled' : 'active';
      return { ...m, ...item, remainingAmount: remaining, status };
    }));
    showToast(`Record updated successfully!`);
  };

  const deleteMoneyLent = (id: string) => {
    setMoneyLent(prev => prev.filter(m => m.id !== id));
    showToast(`Record deleted.`);
  };

  // Debts & Loans Operations
  const addDebt = (item: Omit<DebtLoan, 'id' | 'remainingAmount' | 'status'>) => {
    const remaining = Math.max(0, item.totalAmount - (item.amountRepaid || 0));
    const status = remaining === 0 ? 'closed' : 'active';
    const newItem: DebtLoan = {
      ...item,
      id: 'debt-' + Date.now(),
      remainingAmount: remaining,
      status
    };
    setDebts(prev => [newItem, ...prev]);
    showToast(`Debt/Loan from "${item.lenderName}" recorded!`);
  };

  const recordDebtPayment = (id: string, amount: number) => {
    setDebts(prev => prev.map(item => {
      if (item.id !== id) return item;
      const newRepaid = item.amountRepaid + amount;
      const newRemaining = Math.max(0, item.totalAmount - newRepaid);
      return {
        ...item,
        amountRepaid: newRepaid,
        remainingAmount: newRemaining,
        status: newRemaining === 0 ? 'closed' : 'active'
      };
    }));
    showToast(`EMI payment of ₹${amount.toLocaleString('en-IN')} recorded!`);
  };

  const updateDebt = (id: string, item: Partial<DebtLoan>) => {
    setDebts(prev => prev.map(d => {
      if (d.id !== id) return d;
      const total = item.totalAmount !== undefined ? item.totalAmount : d.totalAmount;
      const repaid = item.amountRepaid !== undefined ? item.amountRepaid : d.amountRepaid;
      const remaining = Math.max(0, total - repaid);
      return { ...d, ...item, remainingAmount: remaining, status: remaining === 0 ? 'closed' : 'active' };
    }));
  };

  const deleteDebt = (id: string) => {
    setDebts(prev => prev.filter(d => d.id !== id));
    showToast(`Debt/Loan record removed.`);
  };

  // Monthly Budget Operations (Inherit from previous month without mutating past records)
  const getBudgetForMonth = (monthKey: string): MonthlyBudgetDeclaration => {
    if (monthlyBudgets[monthKey]) {
      return monthlyBudgets[monthKey];
    }

    const sortedMonths = Object.keys(monthlyBudgets).sort();
    const priorMonths = sortedMonths.filter(m => m < monthKey);

    let baseCategories: BudgetCategory[] = DEFAULT_BUDGET_CATEGORIES;
    if (priorMonths.length > 0) {
      const latestPrior = priorMonths[priorMonths.length - 1];
      baseCategories = monthlyBudgets[latestPrior].categories.map(c => ({ ...c }));
    }

    const total = baseCategories.reduce((acc, c) => acc + c.budgetedAmount, 0);
    return {
      id: `budget-${monthKey}`,
      monthYear: monthKey,
      categories: baseCategories,
      totalBudgeted: total,
      updatedAt: new Date().toISOString()
    };
  };

  const saveMonthBudget = (monthKey: string, categories: BudgetCategory[]) => {
    const total = categories.reduce((sum, c) => sum + (Number(c.budgetedAmount) || 0), 0);
    setMonthlyBudgets(prev => ({
      ...prev,
      [monthKey]: {
        id: `budget-${monthKey}`,
        monthYear: monthKey,
        categories,
        totalBudgeted: total,
        updatedAt: new Date().toISOString()
      }
    }));
    showToast(`Budget for ${monthKey} saved! (Total: ₹${total.toLocaleString('en-IN')})`);
  };

  const copyBudgetFromPreviousMonth = (targetMonthKey: string) => {
    const sortedMonths = Object.keys(monthlyBudgets).sort();
    const priorMonths = sortedMonths.filter(m => m < targetMonthKey);
    if (priorMonths.length > 0) {
      const latestPrior = priorMonths[priorMonths.length - 1];
      const clonedCategories = monthlyBudgets[latestPrior].categories.map(c => ({ ...c }));
      saveMonthBudget(targetMonthKey, clonedCategories);
      showToast(`Copied budget template from prior month!`);
    }
  };

  const renameCategory = (categoryId: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    setMonthlyBudgets(prev => {
      const updated: Record<string, MonthlyBudgetDeclaration> = {};
      for (const mKey of Object.keys(prev)) {
        const b = prev[mKey];
        if (b.categories.some(c => c.id === categoryId)) {
          updated[mKey] = {
            ...b,
            categories: b.categories.map(c => c.id === categoryId ? { ...c, name: trimmed } : c),
            updatedAt: new Date().toISOString()
          };
        } else {
          updated[mKey] = b;
        }
      }
      return updated;
    });

    setDailyExpenses(prev => prev.map(exp => {
      if (exp.categoryId === categoryId) {
        return { ...exp, categoryName: trimmed };
      }
      return exp;
    }));

    showToast(`Category renamed to "${trimmed}"`);
  };

  // Daily Expenses Operations
  const addDailyExpense = (exp: Omit<DailyExpense, 'id' | 'createdAt'>, deductFromAccount = false) => {
    const newExp: DailyExpense = {
      ...exp,
      id: 'exp-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setDailyExpenses(prev => [newExp, ...prev]);

    if (deductFromAccount && exp.bankAccountId) {
      setAccounts(prev => prev.map(a => {
        if (a.id === exp.bankAccountId) {
          return { ...a, balance: Math.max(0, a.balance - exp.amount), updatedAt: new Date().toISOString() };
        }
        return a;
      }));
    }
    showToast(`Expense of ₹${exp.amount.toLocaleString('en-IN')} logged!`);
  };

  const updateDailyExpense = (id: string, updated: Partial<DailyExpense>, adjustAccountBalance = true) => {
    const existing = dailyExpenses.find(e => e.id === id);
    if (!existing) return;

    const oldAmount = existing.amount;
    const oldAccountId = existing.bankAccountId;
    const newAmount = updated.amount !== undefined ? updated.amount : oldAmount;
    const newAccountId = updated.bankAccountId !== undefined ? updated.bankAccountId : oldAccountId;

    setDailyExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));

    if (adjustAccountBalance && (oldAccountId || newAccountId)) {
      setAccounts(prev => prev.map(acc => {
        let balance = acc.balance;
        if (oldAccountId === newAccountId && acc.id === oldAccountId) {
          balance = Math.max(0, balance + oldAmount - newAmount);
        } else {
          if (acc.id === oldAccountId) {
            balance = balance + oldAmount;
          }
          if (acc.id === newAccountId) {
            balance = Math.max(0, balance - newAmount);
          }
        }
        return { ...acc, balance, updatedAt: new Date().toISOString() };
      }));
    }

    showToast(`Expense "${updated.title || existing.title}" updated!`);
  };

  const deleteDailyExpense = (id: string, refundToAccount = true) => {
    const existing = dailyExpenses.find(e => e.id === id);
    if (existing && refundToAccount && existing.bankAccountId) {
      setAccounts(prev => prev.map(acc => {
        if (acc.id === existing.bankAccountId) {
          return { ...acc, balance: acc.balance + existing.amount, updatedAt: new Date().toISOString() };
        }
        return acc;
      }));
    }
    setDailyExpenses(prev => prev.filter(e => e.id !== id));
    showToast(`Expense deleted.`);
  };

  // Core Survival Calculation
  const currentBudget = getBudgetForMonth(selectedMonth);
  const totalCapital = accounts.reduce((acc, a) => acc + (Number(a.balance) || 0), 0);
  const totalReceivables = moneyLent.reduce((acc, m) => acc + (Number(m.remainingAmount) || 0), 0);
  const totalPayables = debts.reduce((acc, d) => acc + (Number(d.remainingAmount) || 0), 0);
  const netWorth = totalCapital + totalReceivables - totalPayables;

  const monthlyBurnRate = currentBudget.totalBudgeted || 1;
  const essentialMonthlyBurnRate = currentBudget.categories
    .filter(c => c.isEssential)
    .reduce((sum, c) => sum + (Number(c.budgetedAmount) || 0), 0) || 1;

  const actualSpentThisMonth = dailyExpenses
    .filter(e => e.date.startsWith(selectedMonth))
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const dailyBurn = monthlyBurnRate / 30;
  const totalDays = dailyBurn > 0 ? Math.floor(totalCapital / dailyBurn) : 0;
  const months = Math.floor(totalDays / 30);
  const daysRemainder = totalDays % 30;

  const essentialDailyBurn = essentialMonthlyBurnRate / 30;
  const essentialTotalDays = essentialDailyBurn > 0 ? Math.floor(totalCapital / essentialDailyBurn) : 0;
  const essentialMonths = Math.floor(essentialTotalDays / 30);
  const essentialDaysRemainder = essentialTotalDays % 30;

  const calcRunwayDate = (daysCount: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysCount);
    return target.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const survivalAnalysis: SurvivalAnalysis = {
    totalCapital,
    totalReceivables,
    totalPayables,
    netWorth,
    monthlyBurnRate,
    essentialMonthlyBurnRate,
    actualSpentThisMonth,
    daysRemaining: daysRemainder,
    monthsRemaining: months,
    essentialDaysRemaining: essentialDaysRemainder,
    essentialMonthsRemaining: essentialMonths,
    runwayDate: calcRunwayDate(totalDays),
    runwayDateEssential: calcRunwayDate(essentialTotalDays)
  };

  const resetToSampleData = () => {
    setAccounts(getSampleAccounts());
    setMoneyLent(getSampleMoneyLent());
    setDebts(getSampleDebts());
    setDailyExpenses(getSampleExpenses());
    const curr = getCurrentMonthKey();
    const sum = DEFAULT_BUDGET_CATEGORIES.reduce((acc, c) => acc + c.budgetedAmount, 0);
    setMonthlyBudgets({
      [curr]: {
        id: `budget-${curr}`,
        monthYear: curr,
        categories: DEFAULT_BUDGET_CATEGORIES,
        totalBudgeted: sum,
        updatedAt: new Date().toISOString()
      }
    });
  };

  const clearAllData = () => {
    setAccounts([]);
    setMoneyLent([]);
    setDebts([]);
    setDailyExpenses([]);
    const curr = getCurrentMonthKey();
    const cleanZeroCategories = DEFAULT_BUDGET_CATEGORIES.map(c => ({ ...c, budgetedAmount: 0 }));
    setMonthlyBudgets({
      [curr]: {
        id: `budget-${curr}`,
        monthYear: curr,
        categories: cleanZeroCategories,
        totalBudgeted: 0,
        updatedAt: new Date().toISOString()
      }
    });

    try {
      localStorage.removeItem('surviva_accounts');
      localStorage.removeItem('surviva_money_lent');
      localStorage.removeItem('surviva_debts');
      localStorage.removeItem('surviva_expenses');
      localStorage.removeItem('surviva_budgets');
      localStorage.removeItem('surviva_guest_accounts');
      localStorage.removeItem('surviva_guest_money_lent');
      localStorage.removeItem('surviva_guest_debts');
      localStorage.removeItem('surviva_guest_expenses');
      localStorage.removeItem('surviva_guest_budgets');
    } catch (e) {
      console.warn('LocalStorage clear error', e);
    }
  };

  // Offline Export / Backup
  const exportBackupJSON = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      userUid: user?.uid || 'offline_user',
      accounts,
      moneyLent,
      debts,
      monthlyBudgets,
      dailyExpenses
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SurvivaTrack_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Offline Import / Restore
  const importBackupJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.accounts) setAccounts(data.accounts);
      if (data.moneyLent) setMoneyLent(data.moneyLent);
      if (data.debts) setDebts(data.debts);
      if (data.monthlyBudgets) setMonthlyBudgets(data.monthlyBudgets);
      if (data.dailyExpenses) setDailyExpenses(data.dailyExpenses);
      return true;
    } catch (err) {
      console.error('Failed to import backup JSON:', err);
      return false;
    }
  };

  return (
    <AppContext.Provider value={{
      accounts,
      addAccount,
      updateAccount,
      deleteAccount,
      moneyLent,
      addMoneyLent,
      recordLentRepayment,
      updateMoneyLent,
      deleteMoneyLent,
      debts,
      addDebt,
      recordDebtPayment,
      updateDebt,
      deleteDebt,
      selectedMonth,
      setSelectedMonth,
      getBudgetForMonth,
      saveMonthBudget,
      copyBudgetFromPreviousMonth,
      renameCategory,
      dailyExpenses,
      addDailyExpense,
      updateDailyExpense,
      deleteDailyExpense,
      survivalAnalysis,
      resetToSampleData,
      clearAllData,
      toast,
      showToast,
      exportBackupJSON,
      importBackupJSON
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
