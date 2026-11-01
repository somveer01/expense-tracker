import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Trash2, 
  Edit3, 
  Wallet, 
  Coins, 
  Check, 
  X
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

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Bank Accounts & Capital</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/40 font-semibold">
              {accounts.length} Active
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track all bank balances (PNB, HDFC, SBI, Cash in Hand). This forms your total available liquid survival fund.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Total Liquid Capital:</span>
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(survivalAnalysis.totalCapital)}
            </span>
          </div>
          <button
            onClick={openAddModal}
            className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Account</span>
          </button>
        </div>
      </div>

      {/* Accounts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {accounts.map(acc => {
          const isQuickEditing = quickEditId === acc.id;

          return (
            <div 
              key={acc.id} 
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-3xl p-5 shadow-sm hover:shadow transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-slate-700">
                      {acc.accountType === 'cash' ? (
                        <Coins className="w-5 h-5 text-amber-500" />
                      ) : (
                        <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{acc.bankName}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="capitalize">{acc.accountType}</span>
                        {acc.accountNumberLast4 && (
                          <span>• A/C: •••• {acc.accountNumberLast4}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={() => openEditModal(acc)}
                      className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Edit Account"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to remove ${acc.bankName}?`)) {
                          deleteAccount(acc.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Balance Section */}
                <div className="mt-5 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-between">
                    <span>Available Balance:</span>
                    {!isQuickEditing && (
                      <button
                        onClick={() => {
                          setQuickEditId(acc.id);
                          setQuickBalance(acc.balance);
                        }}
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                      >
                        Update
                      </button>
                    )}
                  </div>

                  {isQuickEditing ? (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-1.5 text-xs text-slate-400">₹</span>
                        <input
                          type="number"
                          autoFocus
                          value={quickBalance}
                          onChange={(e) => setQuickBalance(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full pl-6 pr-2 py-1 bg-white dark:bg-slate-900 border border-indigo-500 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={() => handleQuickBalanceSave(acc.id)}
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg"
                        title="Save"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setQuickEditId(null)}
                        className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(acc.balance)}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
                <span>Updated: {new Date(acc.updatedAt).toLocaleDateString('en-US')}</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {((acc.balance / (survivalAnalysis.totalCapital || 1)) * 100).toFixed(0)}% of total
                </span>
              </div>
            </div>
          );
        })}

        {/* Add Account Card */}
        <div 
          onClick={openAddModal}
          className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition min-h-[190px] group bg-white/40 dark:bg-slate-900/30 hover:bg-white dark:hover:bg-slate-900/60"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <Plus className="w-6 h-6" />
          </div>
          <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Add New Bank Account or Cash</p>
          <p className="text-xs text-slate-400 mt-1">PNB, HDFC, SBI, Cash in Hand, etc.</p>
        </div>
      </div>

      {/* Add / Edit Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              {editingAccount ? 'Edit Account' : 'Add Bank Account or Cash Reserve'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Bank or Source Name</label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. HDFC Bank, PNB, Cash in Hand"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Account Type</label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white focus:border-indigo-500 outline-none"
                  >
                    <option value="savings">Savings Account</option>
                    <option value="salary">Salary Account</option>
                    <option value="cash">Cash in Hand</option>
                    <option value="current">Current Account</option>
                    <option value="fd">Fixed Deposit</option>
                    <option value="wallet">Digital Wallet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Last 4 Digits</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={accountNumberLast4}
                    onChange={(e) => setAccountNumberLast4(e.target.value)}
                    placeholder="e.g. 4589"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Available Balance (₹)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={balance}
                  onChange={(e) => setBalance(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="₹ 50,000"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition shadow-sm"
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
