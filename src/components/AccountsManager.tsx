import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Trash2, 
  Edit3, 
  Wallet, 
  Coins, 
  Check, 
  X,
  CreditCard,
  Landmark,
  PiggyBank,
  Smartphone,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BankAccount } from '../types';

interface AccountsManagerProps {
  isAddModalOpen?: boolean;
  setIsAddModalOpen?: (open: boolean) => void;
}

export const AccountsManager: React.FC<AccountsManagerProps> = ({
  isAddModalOpen: parentAddModalOpen,
  setIsAddModalOpen: parentSetAddModalOpen
}) => {
  const { accounts, addAccount, updateAccount, deleteAccount, survivalAnalysis } = useApp();

  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const isModalOpen = parentAddModalOpen !== undefined ? parentAddModalOpen : internalModalOpen;
  const setIsModalOpen = parentSetAddModalOpen || setInternalModalOpen;

  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);

  // Form State
  const [bankName, setBankName] = useState('');
  const [accountType, setAccountType] = useState<BankAccount['accountType']>('savings');
  const [accountNumberLast4, setAccountNumberLast4] = useState('');
  const [balance, setBalance] = useState<number | ''>('');

  // Inline Quick Balance Edit
  const [quickEditId, setQuickEditId] = useState<string | null>(null);
  const [quickBalance, setQuickBalance] = useState<number | ''>('');

  const formatCurrency = (amt: number) => '₹' + amt.toLocaleString('en-IN');

  const openAddModal = () => {
    setEditingAccount(null);
    setBankName('');
    setAccountType('savings');
    setAccountNumberLast4('');
    setBalance('');
    setIsModalOpen(true);
  };

  const openEditModal = (acc: BankAccount) => {
    setEditingAccount(acc);
    setBankName(acc.bankName);
    setAccountType(acc.accountType);
    setAccountNumberLast4(acc.accountNumberLast4 || '');
    setBalance(acc.balance);
    setIsModalOpen(true);
  };

  const parseNumber = (val: any): number => {
    if (typeof val === 'number') return val;
    const clean = String(val).replace(/[^0-9.-]+/g, '');
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName.trim() || balance === '') return;

    const parsedBalance = parseNumber(balance);

    if (editingAccount) {
      updateAccount(editingAccount.id, {
        bankName: bankName.trim(),
        accountType,
        accountNumberLast4: accountNumberLast4.trim() || undefined,
        balance: parsedBalance
      });
    } else {
      addAccount({
        bankName: bankName.trim(),
        accountType,
        accountNumberLast4: accountNumberLast4.trim() || undefined,
        balance: parsedBalance
      });
    }

    setIsModalOpen(false);
  };

  const handleQuickBalanceSave = (id: string) => {
    if (quickBalance !== '') {
      updateAccount(id, { balance: parseNumber(quickBalance) });
    }
    setQuickEditId(null);
  };

  const getAccountIcon = (type: BankAccount['accountType']) => {
    switch (type) {
      case 'cash':
        return <Coins className="w-5 h-5 text-amber-500" />;
      case 'salary':
        return <Landmark className="w-5 h-5 text-indigo-500" />;
      case 'current':
        return <Building2 className="w-5 h-5 text-blue-500" />;
      case 'fd':
        return <PiggyBank className="w-5 h-5 text-purple-500" />;
      case 'wallet':
        return <Smartphone className="w-5 h-5 text-rose-500" />;
      case 'savings':
      default:
        return <Wallet className="w-5 h-5 text-emerald-500" />;
    }
  };

  const getAccountCardBg = (type: BankAccount['accountType']) => {
    switch (type) {
      case 'salary':
        return 'from-indigo-50/80 via-white to-slate-50 dark:from-indigo-950/20 dark:via-slate-900 dark:to-slate-900 border-indigo-200/80 dark:border-indigo-900/40';
      case 'cash':
        return 'from-amber-50/80 via-white to-slate-50 dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 border-amber-200/80 dark:border-amber-900/40';
      case 'fd':
        return 'from-purple-50/80 via-white to-slate-50 dark:from-purple-950/20 dark:via-slate-900 dark:to-slate-900 border-purple-200/80 dark:border-purple-900/40';
      case 'current':
        return 'from-blue-50/80 via-white to-slate-50 dark:from-blue-950/20 dark:via-slate-900 dark:to-slate-900 border-blue-200/80 dark:border-blue-900/40';
      default:
        return 'from-emerald-50/80 via-white to-slate-50 dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900 border-emerald-200/80 dark:border-emerald-900/40';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner (Compact) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Wallet className="w-3.5 h-3.5" />
            </span>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Bank Accounts & Capital
            </h1>
            <span className="text-[11px] px-2 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/40 font-bold">
              {accounts.length} Active
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total liquid survival fund across all accounts and cash.
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          <div className="text-left sm:text-right">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Total Capital</span>
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
              {formatCurrency(survivalAnalysis.totalCapital)}
            </span>
          </div>
          <button
            onClick={openAddModal}
            className="py-2 px-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-xs shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Account</span>
          </button>
        </div>
      </div>

      {/* Modern Accounts Cards Grid (Compact) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {accounts.map(acc => {
          const isQuickEditing = quickEditId === acc.id;
          const cardGradient = getAccountCardBg(acc.accountType);
          const percentOfTotal = survivalAnalysis.totalCapital > 0 
            ? ((acc.balance / survivalAnalysis.totalCapital) * 100).toFixed(0) 
            : 0;

          return (
            <div 
              key={acc.id} 
              className={`relative overflow-hidden rounded-2xl p-3.5 sm:p-4 shadow-xs hover:shadow-sm transition-all duration-150 bg-gradient-to-br border ${cardGradient} flex flex-col justify-between group`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-xs border border-slate-200/60 dark:border-slate-700/60 shrink-0">
                      {getAccountIcon(acc.accountType)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug tracking-tight">
                        {acc.bankName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">
                          {acc.accountType}
                        </span>
                        {acc.accountNumberLast4 && (
                          <span>•••• {acc.accountNumberLast4}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={() => openEditModal(acc)}
                      className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-white/80 dark:hover:bg-slate-800 transition"
                      title="Edit Account"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to remove ${acc.bankName}?`)) {
                          deleteAccount(acc.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-white/80 dark:hover:bg-slate-800 transition"
                      title="Delete Account"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Balance Card Section */}
                <div className="mt-3 p-3 rounded-xl bg-white/90 dark:bg-slate-850/90 border border-slate-200/70 dark:border-slate-750 backdrop-blur-sm">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-0.5 flex items-center justify-between">
                    <span className="font-medium">Current Balance:</span>
                    {!isQuickEditing && (
                      <button
                        onClick={() => {
                          setQuickEditId(acc.id);
                          setQuickBalance(acc.balance);
                        }}
                        className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                      >
                        Quick Edit
                      </button>
                    )}
                  </div>

                  {isQuickEditing ? (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-1.5 text-xs text-slate-400 font-bold">₹</span>
                        <input
                          type="number"
                          autoFocus
                          value={quickBalance}
                          onChange={(e) => setQuickBalance(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full pl-6 pr-2 py-1 bg-white dark:bg-slate-900 border border-indigo-500 rounded-lg text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={() => handleQuickBalanceSave(acc.id)}
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
                        title="Save"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setQuickEditId(null)}
                        className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                      {formatCurrency(acc.balance)}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Info Bar */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 flex justify-between items-center">
                <span>Updated: {new Date(acc.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className="font-semibold text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200/60 dark:border-transparent">
                  {percentOfTotal}% of total
                </span>
              </div>
            </div>
          );
        })}

        {/* Add Account Card */}
        <div 
          onClick={openAddModal}
          className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition min-h-[210px] group bg-white/40 dark:bg-slate-900/30 hover:bg-white dark:hover:bg-slate-900/60"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition shadow-xs">
            <Plus className="w-6 h-6" />
          </div>
          <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Add Bank Account or Cash</p>
          <p className="text-xs text-slate-400 mt-1">PNB, HDFC, SBI, Cash in Hand, etc.</p>
        </div>
      </div>

      {/* Add / Edit Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 dark:hover:text-white p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/80 dark:border-emerald-800/40">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingAccount ? 'Edit Bank Account' : 'Add Bank Account or Cash'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update balances to calculate exact survival runway
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bank or Reserve Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. HDFC Bank, PNB, Cash in Hand"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              {/* Account Type Selector Chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Account Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'savings', label: 'Savings', icon: Wallet },
                    { id: 'salary', label: 'Salary', icon: Landmark },
                    { id: 'cash', label: 'Cash', icon: Coins },
                    { id: 'current', label: 'Current', icon: Building2 },
                    { id: 'fd', label: 'Fixed Dep', icon: PiggyBank },
                    { id: 'wallet', label: 'Wallet', icon: Smartphone }
                  ].map(item => {
                    const isSelected = accountType === item.id;
                    const IconComponent = item.icon;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setAccountType(item.id as any)}
                        className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                        }`}
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Last 4 Digits (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={accountNumberLast4}
                    onChange={(e) => setAccountNumberLast4(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="4589"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Available Balance (₹) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      required
                      min={0}
                      value={balance}
                      onChange={(e) => setBalance(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="50,000"
                      className="w-full pl-7 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>
              </div>

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
                  {editingAccount ? 'Save Changes' : 'Add Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
