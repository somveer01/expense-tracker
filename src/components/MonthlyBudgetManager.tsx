import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  ShieldCheck, 
  ShieldAlert,
  Flame,
  Droplets,
  Home,
  CreditCard,
  ShoppingBag,
  Zap,
  Wifi,
  Coffee,
  HeartPulse,
  Film,
  MoreHorizontal,
  X,
  PieChart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BudgetCategory } from '../types';

export const MonthlyBudgetManager: React.FC = () => {
  const { 
    selectedMonth, 
    getBudgetForMonth, 
    saveMonthBudget, 
    copyBudgetFromPreviousMonth,
    dailyExpenses
  } = useApp();

  const currentDeclaration = getBudgetForMonth(selectedMonth);
  const [categories, setCategories] = useState<BudgetCategory[]>(currentDeclaration.categories);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Category Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatAmount, setNewCatAmount] = useState<number | ''>('');
  const [newCatEssential, setNewCatEssential] = useState(true);

  useEffect(() => {
    const budget = getBudgetForMonth(selectedMonth);
    setCategories(budget.categories);
    setSaveSuccess(false);
  }, [selectedMonth]);

  const formatCurrency = (amt: number) => '₹' + amt.toLocaleString('en-IN');

  const monthExpenses = dailyExpenses.filter(e => e.date.startsWith(selectedMonth));
  const getSpentForCategory = (catId: string) => {
    return monthExpenses.filter(e => e.categoryId === catId).reduce((sum, e) => sum + e.amount, 0);
  };

  const handleAmountChange = (id: string, value: string) => {
    const clean = String(value).replace(/[^0-9.-]+/g, '');
    const num = clean === '' ? 0 : Number(clean);
    setCategories(prev => {
      const next = prev.map(c => c.id === id ? { ...c, budgetedAmount: num } : c);
      saveMonthBudget(selectedMonth, next);
      return next;
    });
  };

  const handleToggleEssential = (id: string) => {
    setCategories(prev => {
      const next = prev.map(c => c.id === id ? { ...c, isEssential: !c.isEssential } : c);
      saveMonthBudget(selectedMonth, next);
      return next;
    });
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => {
      const next = prev.filter(c => c.id !== id);
      saveMonthBudget(selectedMonth, next);
      return next;
    });
  };

  const handleSave = () => {
    saveMonthBudget(selectedMonth, categories);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleCopyPrior = () => {
    copyBudgetFromPreviousMonth(selectedMonth);
    const updated = getBudgetForMonth(selectedMonth);
    setCategories(updated.categories);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim() || newCatAmount === '') return;

    const newCat: BudgetCategory = {
      id: 'cat-' + Date.now(),
      name: newCatName.trim(),
      budgetedAmount: Number(newCatAmount),
      isEssential: newCatEssential
    };

    const updated = [...categories, newCat];
    setCategories(updated);
    saveMonthBudget(selectedMonth, updated);

    setNewCatName('');
    setNewCatAmount('');
    setNewCatEssential(true);
    setIsAddModalOpen(false);
  };

  const totalCurrent = categories.reduce((sum, c) => sum + (Number(c.budgetedAmount) || 0), 0);
  const essentialCurrent = categories
    .filter(c => c.isEssential)
    .reduce((sum, c) => sum + (Number(c.budgetedAmount) || 0), 0);
  const discretionaryCurrent = totalCurrent - essentialCurrent;

  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('rent') || n.includes('flat')) return <Home className="w-4 h-4 text-amber-500" />;
    if (n.includes('emi') || n.includes('loan')) return <CreditCard className="w-4 h-4 text-purple-500" />;
    if (n.includes('food') || n.includes('grocery')) return <ShoppingBag className="w-4 h-4 text-emerald-500" />;
    if (n.includes('gas') || n.includes('fuel')) return <Flame className="w-4 h-4 text-rose-500" />;
    if (n.includes('water')) return <Droplets className="w-4 h-4 text-cyan-500" />;
    if (n.includes('electric') || n.includes('power')) return <Zap className="w-4 h-4 text-yellow-500" />;
    if (n.includes('recharge') || n.includes('wifi') || n.includes('phone')) return <Wifi className="w-4 h-4 text-indigo-500" />;
    if (n.includes('daily') || n.includes('dairy') || n.includes('milk')) return <Coffee className="w-4 h-4 text-orange-500" />;
    if (n.includes('medical') || n.includes('health')) return <HeartPulse className="w-4 h-4 text-red-500" />;
    if (n.includes('dining') || n.includes('entertainment')) return <Film className="w-4 h-4 text-pink-500" />;
    return <MoreHorizontal className="w-4 h-4 text-slate-400" />;
  };

  const getCategoryBg = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('rent')) return 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/40';
    if (n.includes('emi') || n.includes('loan')) return 'bg-purple-50 dark:bg-purple-950/40 border-purple-200/60 dark:border-purple-900/40';
    if (n.includes('food') || n.includes('grocery')) return 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40';
    if (n.includes('gas') || n.includes('fuel')) return 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-900/40';
    if (n.includes('water')) return 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200/60 dark:border-cyan-900/40';
    if (n.includes('electric')) return 'bg-yellow-50 dark:bg-yellow-950/40 border-yellow-200/60 dark:border-yellow-900/40';
    if (n.includes('recharge') || n.includes('wifi')) return 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/60 dark:border-indigo-900/40';
    if (n.includes('daily') || n.includes('dairy')) return 'bg-orange-50 dark:bg-orange-950/40 border-orange-200/60 dark:border-orange-900/40';
    if (n.includes('medical')) return 'bg-red-50 dark:bg-red-950/40 border-red-200/60 dark:border-red-900/40';
    return 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <PieChart className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Monthly Budget Declaration
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/40 font-semibold">
              Month: {selectedMonth}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
            Declare your estimated expenditure for the month (Rent, EMI, Groceries, Gas, Utilities). 
            Changes are saved in real-time. Past months remain securely preserved.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyPrior}
            className="py-2.5 px-3.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-2xl flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition"
            title="Copy declarations from previous month"
          >
            <Copy className="w-3.5 h-3.5 text-indigo-500" />
            <span>Copy Prior Month</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="py-2.5 px-3.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-2xl flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Add Category</span>
          </button>

          <button
            onClick={handleSave}
            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold rounded-2xl flex items-center gap-1.5 transition shadow-md shadow-emerald-600/20"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Budget</span>
            )}
          </button>
        </div>
      </div>

      {/* KPI Cards: Total Burn vs Essential vs Discretionary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Burn */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">
            Total Declared Budget ({selectedMonth})
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(totalCurrent)}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">/mo</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            Estimated daily burn: ~{formatCurrency(Math.round(totalCurrent / 30))}/day
          </p>
        </div>

        {/* Essential Only */}
        <div className="bg-gradient-to-br from-emerald-50/70 via-white to-slate-50 dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900 border border-emerald-200/80 dark:border-emerald-900/40 rounded-3xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Essential Survival Needs
            </span>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
              {totalCurrent > 0 ? ((essentialCurrent / totalCurrent) * 100).toFixed(0) : 0}%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
            {formatCurrency(essentialCurrent)}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">/mo</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            Rent, Groceries, EMIs, Utilities, Medicines
          </p>
        </div>

        {/* Discretionary */}
        <div className="bg-gradient-to-br from-amber-50/70 via-white to-slate-50 dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 border border-amber-200/80 dark:border-amber-900/40 rounded-3xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              Discretionary Spending
            </span>
            <span className="text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full">
              {totalCurrent > 0 ? ((discretionaryCurrent / totalCurrent) * 100).toFixed(0) : 0}%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight">
            {formatCurrency(discretionaryCurrent)}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">/mo</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            Cutting non-essentials extends your survival runway!
          </p>
        </div>
      </div>

      {/* Modern Category List Editor Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-850">
          <div>
            <h2 className="font-extrabold text-slate-900 dark:text-white text-base">Category Allocations</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Type your planned monthly amount. Actual expenses for this month are compared automatically.
            </p>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold self-start sm:self-center">
            {categories.length} Categories Declared
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {categories.map(cat => {
            const spent = getSpentForCategory(cat.id);
            const utilization = cat.budgetedAmount > 0 
              ? Math.min(100, Math.round((spent / cat.budgetedAmount) * 100))
              : spent > 0 ? 100 : 0;
            const catBg = getCategoryBg(cat.name);

            return (
              <div 
                key={cat.id} 
                className="p-4 sm:px-6 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${catBg}`}>
                    {getCategoryIcon(cat.name)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                      {cat.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => handleToggleEssential(cat.id)}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition flex items-center gap-1 cursor-pointer ${
                          cat.isEssential 
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-slate-800'
                        }`}
                      >
                        {cat.isEssential ? '✓ Essential Need' : 'Optional Want'}
                      </button>

                      {cat.budgetedAmount > 0 && (
                        <span className="text-[10px] text-slate-400 font-medium">
                          {((cat.budgetedAmount / (totalCurrent || 1)) * 100).toFixed(0)}% of total
                        </span>
                      )}

                      {/* Actual Spend Mini Indicator */}
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        • Actual Spent: <strong className={spent > cat.budgetedAmount && cat.budgetedAmount > 0 ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-700 dark:text-slate-300 font-bold'}>{formatCurrency(spent)}</strong>
                      </span>
                    </div>

                    {/* Mini category burn bar */}
                    {cat.budgetedAmount > 0 && (
                      <div className="w-36 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            utilization > 100 ? 'bg-rose-500' : utilization > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${utilization}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Amount Input & Delete Action */}
                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <div className="relative w-36 sm:w-44">
                    <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      min={0}
                      value={cat.budgetedAmount === 0 ? '' : cat.budgetedAmount}
                      onChange={(e) => handleAmountChange(cat.id, e.target.value)}
                      placeholder="0"
                      className="w-full pl-7 pr-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white text-right focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete budget category "${cat.name}"?`)) {
                        handleDeleteCategory(cat.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-slate-800 transition"
                    title="Remove Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Save Bar */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Changes auto-save instantly as you type.
          </span>
          <button
            onClick={handleSave}
            className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold rounded-2xl flex items-center gap-1.5 transition shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Budget</span>
            )}
          </button>
        </div>
      </div>

      {/* Add Custom Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 dark:hover:text-white p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/80 dark:border-indigo-800/40">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add Budget Category</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Create a personalized monthly allocation</p>
              </div>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Children School Fee, Pet Food, Gym"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Monthly Budget Allocation (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newCatAmount}
                    onChange={(e) => setNewCatAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="3,000"
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-white block">Essential Survival Need</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Uncheck if this is optional/discretionary</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={newCatEssential} 
                    onChange={(e) => setNewCatEssential(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl transition shadow-md shadow-indigo-600/20"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
