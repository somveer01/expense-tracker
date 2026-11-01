import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Calendar, 
  Search, 
  Filter, 
  Wallet, 
  X
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
    deleteDailyExpense, 
    selectedMonth, 
    accounts, 
    getBudgetForMonth,
    survivalAnalysis 
  } = useApp();

  const [localModalOpen, setLocalModalOpen] = useState(false);
  const isModalOpen = parentModalOpen !== undefined ? parentModalOpen : localModalOpen;
  const setIsModalOpen = parentSetModalOpen || setLocalModalOpen;

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

  const openAddModal = () => {
    setTitle('');
    setAmount('');
    setCategoryId(currentBudget.categories[0]?.id || '');
    setDate(new Date().toISOString().split('T')[0]);
    setBankAccountId(accounts[0]?.id || '');
    setDeductFromAccount(true);
    setNotes('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount === '') return;

    const matchedCat = currentBudget.categories.find(c => c.id === categoryId);
    const categoryName = matchedCat ? matchedCat.name : 'Other Expense';

    addDailyExpense({
      title: title.trim(),
      amount: Number(amount),
      categoryId,
      categoryName,
      date,
      bankAccountId: bankAccountId || undefined,
      notes: notes || undefined
    }, deductFromAccount);

    setIsModalOpen(false);
  };

  // Filter current month expenses
  const monthExpenses = dailyExpenses.filter(e => e.date.startsWith(selectedMonth));

  const filteredExpenses = monthExpenses.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exp.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedFilterCategory === 'all' || exp.categoryId === selectedFilterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalSpentThisMonth = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Daily Actual Expenses</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/40 font-semibold">
              Month: {selectedMonth}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Log day-to-day purchases and bills. Directly tracks against your declared monthly budget and bank balances.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Total Spent This Month:</span>
            <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
              {formatCurrency(totalSpentThisMonth)}
            </span>
          </div>
          <button
            onClick={openAddModal}
            className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Monthly Budget vs Actual Health Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="text-slate-700 dark:text-slate-300 font-medium">
            Declared Budget Utilization: <strong className="text-slate-900 dark:text-white font-bold">{formatCurrency(totalSpentThisMonth)}</strong> / {formatCurrency(survivalAnalysis.monthlyBurnRate)}
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            Remaining Budget: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(Math.max(0, survivalAnalysis.monthlyBurnRate - totalSpentThisMonth))}</strong>
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/80 dark:border-slate-700">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-amber-500 to-rose-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (totalSpentThisMonth / (survivalAnalysis.monthlyBurnRate || 1)) * 100)}%` }}
          />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900/60 p-4 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search expense (e.g. groceries, gas)..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedFilterCategory}
            onChange={(e) => setSelectedFilterCategory(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="all">All Categories</option>
            {currentBudget.categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {filteredExpenses.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShoppingBag className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
            <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">No Expenses Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Click "+ Add Expense" above to record any spending for this month.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredExpenses.map(exp => {
              const account = accounts.find(a => a.id === exp.bankAccountId);

              return (
                <div 
                  key={exp.id}
                  className="p-4 hover:bg-slate-50/80 dark:hover:bg-slate-850 transition flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-slate-800 border border-rose-100 dark:border-slate-700 text-rose-500 flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">{exp.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{exp.categoryName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3 h-3" />
                          {exp.date}
                        </span>
                        {account && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-[10px] font-medium border border-slate-200/60 dark:border-transparent">
                              <Wallet className="w-3 h-3 text-emerald-500" />
                              {account.bankName}
                            </span>
                          </>
                        )}
                      </div>
                      {exp.notes && (
                        <p className="text-[11px] text-slate-400 mt-1">{exp.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-base font-extrabold text-rose-600 dark:text-rose-400">
                        -{formatCurrency(exp.amount)}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Delete "${exp.title}"?`)) {
                          deleteDailyExpense(exp.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Add Daily Expense</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Item / Expense Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Groceries, LPG Gas, Wi-Fi"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="₹ 850"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white focus:border-indigo-500 outline-none"
                >
                  {currentBudget.categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Paid From Account</label>
                <select
                  value={bankAccountId}
                  onChange={(e) => setBankAccountId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white focus:border-indigo-500 outline-none"
                >
                  <option value="">None (Record only)</option>
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.bankName} (Balance: {formatCurrency(a.balance)})
                    </option>
                  ))}
                </select>
              </div>

              {bankAccountId && (
                <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-transparent">
                  <input
                    type="checkbox"
                    id="deductCheck"
                    checked={deductFromAccount}
                    onChange={(e) => setDeductFromAccount(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 cursor-pointer"
                  />
                  <label htmlFor="deductCheck" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none font-medium">
                    Automatically deduct this amount from selected bank balance
                  </label>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Bought monthly staples in bulk"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition shadow-sm"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
