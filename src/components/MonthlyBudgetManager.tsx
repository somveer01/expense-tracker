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
  MoreHorizontal
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BudgetCategory } from '../types';

export const MonthlyBudgetManager: React.FC = () => {
  const { 
    selectedMonth, 
    getBudgetForMonth, 
    saveMonthBudget, 
    copyBudgetFromPreviousMonth
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

  const handleAmountChange = (id: string, value: string) => {
    const num = value === '' ? 0 : Number(value);
    setCategories(prev => prev.map(c => c.id === id ? { ...c, budgetedAmount: num } : c));
  };

  const handleToggleEssential = (id: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, isEssential: !c.isEssential } : c));
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
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
    if (n.includes('rent')) return <Home className="w-4 h-4 text-amber-500" />;
    if (n.includes('emi') || n.includes('loan')) return <CreditCard className="w-4 h-4 text-purple-500" />;
    if (n.includes('food') || n.includes('grocery')) return <ShoppingBag className="w-4 h-4 text-emerald-500" />;
    if (n.includes('gas') || n.includes('fuel')) return <Flame className="w-4 h-4 text-rose-500" />;
    if (n.includes('water')) return <Droplets className="w-4 h-4 text-cyan-500" />;
    if (n.includes('electric')) return <Zap className="w-4 h-4 text-yellow-500" />;
    if (n.includes('recharge') || n.includes('wifi') || n.includes('phone')) return <Wifi className="w-4 h-4 text-indigo-500" />;
    if (n.includes('daily') || n.includes('dairy') || n.includes('milk')) return <Coffee className="w-4 h-4 text-orange-500" />;
    if (n.includes('medical') || n.includes('health')) return <HeartPulse className="w-4 h-4 text-red-500" />;
    if (n.includes('dining') || n.includes('entertainment')) return <Film className="w-4 h-4 text-pink-500" />;
    return <MoreHorizontal className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Monthly Budget Declaration
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/40 font-semibold">
              Month: {selectedMonth}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
            Declare your estimated expenditure for the month (Rent, EMI, Groceries, Gas, Utilities). 
            Past months remain securely preserved; new months automatically inherit the previous month's template.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyPrior}
            className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition"
            title="Copy declarations from previous month"
          >
            <Copy className="w-3.5 h-3.5 text-indigo-500" />
            <span>Copy From Prior Month</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Add Category</span>
          </button>

          <button
            onClick={handleSave}
            className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-sm"
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
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-1">Total Declared Budget ({selectedMonth})</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {formatCurrency(totalCurrent)}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">/mo</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Estimated daily burn: ~{formatCurrency(Math.round(totalCurrent / 30))}/day
          </p>
        </div>

        {/* Essential Only */}
        <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-950/60 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Essential Survival Needs:
            </span>
            <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-transparent">
              {totalCurrent > 0 ? ((essentialCurrent / totalCurrent) * 100).toFixed(0) : 0}%
            </span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(essentialCurrent)}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">/mo</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Rent, Groceries, EMIs, Utilities, Medicines
          </p>
        </div>

        {/* Discretionary */}
        <div className="bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-950/60 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              Discretionary Spending:
            </span>
            <span className="text-[10px] bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-transparent">
              {totalCurrent > 0 ? ((discretionaryCurrent / totalCurrent) * 100).toFixed(0) : 0}%
            </span>
          </div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {formatCurrency(discretionaryCurrent)}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">/mo</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Cutting these gives you extra months of job search runway!
          </p>
        </div>
      </div>

      {/* Category List Editor Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-850">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white text-base">Category Allocations</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Set amounts for each category or toggle essential survival status</p>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-medium">
            Total Categories: <strong className="text-slate-900 dark:text-white">{categories.length}</strong>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {categories.map(cat => (
            <div 
              key={cat.id} 
              className="p-4 sm:px-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 flex items-center justify-center shrink-0">
                  {getCategoryIcon(cat.name)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm">{cat.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <button
                      type="button"
                      onClick={() => handleToggleEssential(cat.id)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition flex items-center gap-1 ${
                        cat.isEssential 
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-slate-800'
                      }`}
                    >
                      {cat.isEssential ? '✓ Essential Need' : 'Optional / Discretionary'}
                    </button>
                    <span className="text-[10px] text-slate-400">
                      {totalCurrent > 0 ? `${((cat.budgetedAmount / totalCurrent) * 100).toFixed(1)}% of budget` : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amount Input & Delete Action */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="relative w-36 sm:w-44">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min={0}
                    value={cat.budgetedAmount === 0 ? '' : cat.budgetedAmount}
                    onChange={(e) => handleAmountChange(cat.id, e.target.value)}
                    placeholder="0"
                    className="w-full pl-7 pr-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white text-right focus:bg-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Remove Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Save Bar */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Adjust numbers above and click "Save Budget".
          </span>
          <button
            onClick={handleSave}
            className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-sm"
          >
            {saveSuccess ? <Check className="w-4 h-4" /> : null}
            <span>{saveSuccess ? 'Saved Successfully!' : 'Save Budget'}</span>
          </button>
        </div>
      </div>

      {/* Add Custom Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Add Custom Category</h2>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Children School Fee, Pet Care"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Monthly Budget Allocation (₹)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={newCatAmount}
                  onChange={(e) => setNewCatAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="₹ 3,000"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-transparent">
                <input
                  type="checkbox"
                  id="isEssentialCheck"
                  checked={newCatEssential}
                  onChange={(e) => setNewCatEssential(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 cursor-pointer"
                />
                <label htmlFor="isEssentialCheck" className="text-xs text-slate-700 dark:text-slate-200 cursor-pointer select-none font-medium">
                  This is a Survival Essential (Cannot survive without it)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition shadow-sm"
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
