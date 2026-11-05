import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Calendar, 
  Search, 
  Filter, 
  Wallet, 
  X,
  Edit3,
  Home,
  CreditCard,
  Flame,
  Droplets,
  Zap,
  Wifi,
  Coffee,
  HeartPulse,
  Film,
  MoreHorizontal,
  Check,
  TrendingDown,
  ArrowDownRight,
  GraduationCap,
  ShieldCheck,
  Smartphone,
  Wrench,
  Car
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DailyExpense } from '../types';

interface DailyExpensesManagerProps {
  isAddModalOpen?: boolean;
  setIsAddModalOpen?: (open: boolean) => void;
}

export const DailyExpensesManager: React.FC<DailyExpensesManagerProps> = ({
  isAddModalOpen: parentModalOpen,
  setIsAddModalOpen: parentSetModalOpen
}) => {
  const { 
    dailyExpenses, 
    addDailyExpense, 
    updateDailyExpense,
    deleteDailyExpense, 
    selectedMonth, 
    accounts, 
    getBudgetForMonth,
    survivalAnalysis,
    requestDeleteConfirm
  } = useApp();

  const [localModalOpen, setLocalModalOpen] = useState(false);
  const isModalOpen = parentModalOpen !== undefined ? parentModalOpen : localModalOpen;
  const setIsModalOpen = parentSetModalOpen || setLocalModalOpen;

  const [editingExpense, setEditingExpense] = useState<DailyExpense | null>(null);

  const currentBudget = getBudgetForMonth(selectedMonth);

  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [categoryId, setCategoryId] = useState(currentBudget.categories[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [bankAccountId, setBankAccountId] = useState(accounts[0]?.id || '');
  const [deductFromAccount, setDeductFromAccount] = useState(true);
  const [notes, setNotes] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');

  const formatCurrency = (amt: number) => '₹' + amt.toLocaleString('en-IN');

  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('home') || n.includes('rent') || n.includes('flat')) return <Home className="w-4 h-4 text-amber-500" />;
    if (n.includes('fee') || n.includes('shivansh') || n.includes('school') || n.includes('college')) return <GraduationCap className="w-4 h-4 text-purple-500" />;
    if (n.includes('lic') || n.includes('insurance')) return <ShieldCheck className="w-4 h-4 text-teal-500" />;
    if (n.includes('recharge') || n.includes('mobile') || n.includes('phone')) return <Smartphone className="w-4 h-4 text-sky-500" />;
    if (n.includes('food') || n.includes('grocery') || n.includes('ration')) return <ShoppingBag className="w-4 h-4 text-emerald-500" />;
    if (n.includes('water')) return <Droplets className="w-4 h-4 text-cyan-500" />;
    if (n.includes('electric') || n.includes('bijli') || n.includes('power')) return <Zap className="w-4 h-4 text-yellow-500" />;
    if (n.includes('gas') || n.includes('lpg') || n.includes('fuel')) return <Flame className="w-4 h-4 text-rose-500" />;
    if (n.includes('medical') || n.includes('medicine') || n.includes('health') || n.includes('doctor')) return <HeartPulse className="w-4 h-4 text-red-500" />;
    if (n.includes('milk') || n.includes('dairy') || n.includes('doodh')) return <Coffee className="w-4 h-4 text-orange-500" />;
    if (n.includes('manti') || n.includes('maint') || n.includes('repair')) return <Wrench className="w-4 h-4 text-indigo-500" />;
    if (n.includes('traval') || n.includes('travel') || n.includes('petrol') || n.includes('car')) return <Car className="w-4 h-4 text-blue-500" />;
    if (n.includes('wifi') || n.includes('broadband') || n.includes('internet')) return <Wifi className="w-4 h-4 text-violet-500" />;
    if (n.includes('emi') || n.includes('loan')) return <CreditCard className="w-4 h-4 text-purple-500" />;
    if (n.includes('dining') || n.includes('entertainment')) return <Film className="w-4 h-4 text-pink-500" />;
    return <MoreHorizontal className="w-4 h-4 text-slate-400" />;
  };

  const getCategoryBg = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('home') || n.includes('rent')) return 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/40 text-amber-600 dark:text-amber-400';
    if (n.includes('fee') || n.includes('shivansh')) return 'bg-purple-50 dark:bg-purple-950/40 border-purple-200/60 dark:border-purple-900/40 text-purple-600 dark:text-purple-400';
    if (n.includes('lic')) return 'bg-teal-50 dark:bg-teal-950/40 border-teal-200/60 dark:border-teal-900/40 text-teal-600 dark:text-teal-400';
    if (n.includes('recharge')) return 'bg-sky-50 dark:bg-sky-950/40 border-sky-200/60 dark:border-sky-900/40 text-sky-600 dark:text-sky-400';
    if (n.includes('food')) return 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400';
    if (n.includes('water')) return 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200/60 dark:border-cyan-900/40 text-cyan-600 dark:text-cyan-400';
    if (n.includes('electric')) return 'bg-yellow-50 dark:bg-yellow-950/40 border-yellow-200/60 dark:border-yellow-900/40 text-yellow-600 dark:text-yellow-400';
    if (n.includes('gas')) return 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-900/40 text-rose-600 dark:text-rose-400';
    if (n.includes('medical')) return 'bg-red-50 dark:bg-red-950/40 border-red-200/60 dark:border-red-900/40 text-red-600 dark:text-red-400';
    if (n.includes('milk')) return 'bg-orange-50 dark:bg-orange-950/40 border-orange-200/60 dark:border-orange-900/40 text-orange-600 dark:text-orange-400';
    if (n.includes('manti') || n.includes('maint')) return 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/60 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400';
    if (n.includes('traval') || n.includes('travel')) return 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/40 text-blue-600 dark:text-blue-400';
    if (n.includes('wifi')) return 'bg-violet-50 dark:bg-violet-950/40 border-violet-200/60 dark:border-violet-900/40 text-violet-600 dark:text-violet-400';
    if (n.includes('emi') || n.includes('loan')) return 'bg-purple-50 dark:bg-purple-950/40 border-purple-200/60 dark:border-purple-900/40 text-purple-600 dark:text-purple-400';
    return 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300';
  };

  const openAddModal = () => {
    setEditingExpense(null);
    setTitle('');
    setAmount('');
    setCategoryId(currentBudget.categories[0]?.id || '');
    setDate(new Date().toISOString().split('T')[0]);
    setBankAccountId(accounts[0]?.id || '');
    setDeductFromAccount(true);
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (exp: DailyExpense) => {
    setEditingExpense(exp);
    setTitle(exp.title);
    setAmount(exp.amount);
    setCategoryId(exp.categoryId);
    setDate(exp.date);
    setBankAccountId(exp.bankAccountId || accounts[0]?.id || '');
    setDeductFromAccount(true);
    setNotes(exp.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount === '') return;

    const cleanAmt = String(amount).replace(/[^0-9.-]+/g, '');
    const numAmt = parseFloat(cleanAmt);
    if (isNaN(numAmt) || numAmt <= 0) return;

    const effectiveCatId = categoryId || currentBudget.categories[0]?.id || 'cat-misc';
    const matchedCat = currentBudget.categories.find(c => c.id === effectiveCatId);
    const categoryName = matchedCat ? matchedCat.name : 'Daily Expense';

    if (editingExpense) {
      updateDailyExpense(editingExpense.id, {
        title: title.trim(),
        amount: numAmt,
        categoryId: effectiveCatId,
        categoryName,
        date: date || new Date().toISOString().split('T')[0],
        bankAccountId: bankAccountId || undefined,
        notes: notes.trim() || undefined
      }, deductFromAccount);
    } else {
      addDailyExpense({
        title: title.trim(),
        amount: numAmt,
        categoryId: effectiveCatId,
        categoryName,
        date: date || new Date().toISOString().split('T')[0],
        bankAccountId: bankAccountId || undefined,
        notes: notes.trim() || undefined
      }, deductFromAccount);
    }

    setIsModalOpen(false);
  };

  // Filter current month expenses
  const monthExpenses = dailyExpenses.filter(e => e.date.startsWith(selectedMonth));

  const filteredExpenses = monthExpenses.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exp.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (exp.notes && exp.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedFilterCategory === 'all' || exp.categoryId === selectedFilterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalSpentThisMonth = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const budgetUtilization = survivalAnalysis.monthlyBurnRate > 0 
    ? Math.min(100, Math.round((totalSpentThisMonth / survivalAnalysis.monthlyBurnRate) * 100))
    : 0;

  return (
    <div className="space-y-4">
      {/* Modern Top Overview Card (Compact) */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <ShoppingBag className="w-3.5 h-3.5" />
              </span>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Daily Expenses
              </h1>
              <span className="text-[11px] px-2 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                {selectedMonth}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Auto-deducts from bank accounts and tracks against budget.
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Spent This Month</span>
              <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight">
                {formatCurrency(totalSpentThisMonth)}
              </div>
            </div>

            <button
              onClick={openAddModal}
              className="py-2 px-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-xs shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* Budget Burn Progress Bar */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1 font-medium">
              <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
              Budget Utilization: <strong className="text-slate-900 dark:text-white font-bold">{budgetUtilization}%</strong>
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              {formatCurrency(totalSpentThisMonth)} of {formatCurrency(survivalAnalysis.monthlyBurnRate)} declared
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                budgetUtilization > 90 ? 'bg-rose-500' : budgetUtilization > 70 ? 'bg-amber-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${budgetUtilization}%` }}
            />
          </div>
        </div>
      </div>

      {/* Modern Filter & Search Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-2.5 shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, category, or note..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/70 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 px-2 font-medium self-end sm:self-center">
            Showing <strong className="text-slate-900 dark:text-white">{filteredExpenses.length}</strong> of {monthExpenses.length} expenses
          </div>
        </div>

        {/* Horizontal Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
          <button
            onClick={() => setSelectedFilterCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 ${
              selectedFilterCategory === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            All Categories ({monthExpenses.length})
          </button>
          {currentBudget.categories.map(c => {
            const count = monthExpenses.filter(e => e.categoryId === c.id).length;
            const isSelected = selectedFilterCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedFilterCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{c.name}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modern Transaction List (Compact) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        {filteredExpenses.length === 0 ? (
          <div className="p-8 text-center space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto border border-slate-200/60 dark:border-slate-700/60">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">No Expenses Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {searchQuery || selectedFilterCategory !== 'all' 
                ? 'No transactions match your current search or category filter.' 
                : 'You have not recorded any daily expenses for this month yet.'}
            </p>
            <button
              onClick={openAddModal}
              className="mt-1 py-1.5 px-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record First Expense</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredExpenses.map(exp => {
              const account = accounts.find(a => a.id === exp.bankAccountId);
              const catClass = getCategoryBg(exp.categoryName);

              return (
                <div 
                  key={exp.id}
                  className="p-3 sm:p-3.5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition flex items-center justify-between gap-2.5 group"
                >
                  {/* Left: Category Icon & Details */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${catClass}`}>
                      {getCategoryIcon(exp.categoryName)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                          {exp.title}
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {exp.categoryName}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-slate-400 text-[10px]">
                          <Calendar className="w-2.5 h-2.5" />
                          {exp.date}
                        </span>
                        {account && (
                          <>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                              <Wallet className="w-2.5 h-2.5 text-emerald-500" />
                              {account.bankName}
                            </span>
                          </>
                        )}
                      </div>

                      {exp.notes && (
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 truncate max-w-md">
                          "{exp.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Amount & Actions (Edit & Delete) */}
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-extrabold text-rose-600 dark:text-rose-400 tracking-tight flex items-center justify-end">
                        <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                        {formatCurrency(exp.amount)}
                      </div>
                    </div>

                    {/* Action Buttons: Edit & Delete */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(exp)}
                        className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 transition"
                        title="Edit / Modify Expense"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          requestDeleteConfirm({
                            title: 'Delete Expense',
                            message: `Are you sure you want to delete "${exp.title}" (${formatCurrency(exp.amount)})?`,
                            onConfirm: () => deleteDailyExpense(exp.id, true)
                          });
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-slate-800 transition"
                        title="Delete Expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 dark:hover:text-white p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/80 dark:border-indigo-800/40">
                {editingExpense ? <Edit3 className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingExpense ? 'Modify Daily Expense' : 'Add Daily Expense'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {editingExpense ? 'Update amount, category, or bank account' : 'Record day-to-day spending for tracking and runway calculation'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Item or Purpose <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Vegetables, Grocery Store, LPG Gas Refill"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              {/* Amount & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Amount Spent (₹) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                    <input
                      type="text"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value.replace(/[^0-9.]/g, '')))}
                      placeholder="450"
                      className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date of Expense
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition cursor-pointer"
                  />
                </div>
              </div>

              {/* Category Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Budget Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1 border border-slate-200/80 dark:border-slate-700/80 rounded-xl bg-slate-50/50 dark:bg-slate-800/40">
                  {currentBudget.categories.map(cat => {
                    const isSelected = categoryId === cat.id;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setCategoryId(cat.id)}
                        className={`p-2 rounded-xl text-left flex items-center gap-2 transition text-xs font-medium border ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                        }`}
                      >
                        <span className="shrink-0">{getCategoryIcon(cat.name)}</span>
                        <span className="truncate">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bank Account Deduction */}
              {accounts.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Deduct From Bank Balance</span>
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={deductFromAccount} 
                        onChange={(e) => setDeductFromAccount(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  {deductFromAccount && (
                    <select
                      value={bankAccountId}
                      onChange={(e) => setBankAccountId(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
                    >
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>
                          {acc.bankName} (Balance: {formatCurrency(acc.balance)})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes / Bill Details (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Paid via UPI, received 10% discount"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl transition shadow-md shadow-indigo-600/20"
                >
                  {editingExpense ? 'Save Changes' : 'Record Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
