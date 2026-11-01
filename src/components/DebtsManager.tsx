import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUpRight, 
  CheckCircle2, 
  X, 
  Clock, 
  Landmark, 
  Users 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DebtLoan } from '../types';

export const DebtsManager: React.FC = () => {
  const { debts, addDebt, recordDebtPayment, updateDebt, deleteDebt, survivalAnalysis } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DebtLoan | null>(null);

  // Form State
  const [lenderName, setLenderName] = useState('');
  const [type, setType] = useState<DebtLoan['type']>('personal_loan');
  const [totalAmount, setTotalAmount] = useState<number | ''>('');
  const [amountRepaid, setAmountRepaid] = useState<number | ''>(0);
  const [monthlyEMI, setMonthlyEMI] = useState<number | ''>('');
  const [dueDay, setDueDay] = useState<number | ''>(5);
  const [notes, setNotes] = useState('');

  // Repayment Modal
  const [paymentItem, setPaymentItem] = useState<DebtLoan | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number | ''>('');

  const formatCurrency = (amt: number) => '₹' + amt.toLocaleString('en-IN');

  const openAddModal = () => {
    setEditingItem(null);
    setLenderName('');
    setType('personal_loan');
    setTotalAmount('');
    setAmountRepaid(0);
    setMonthlyEMI('');
    setDueDay(5);
    setNotes('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (item: DebtLoan) => {
    setEditingItem(item);
    setLenderName(item.lenderName);
    setType(item.type);
    setTotalAmount(item.totalAmount);
    setAmountRepaid(item.amountRepaid);
    setMonthlyEMI(item.monthlyEMI || '');
    setDueDay(item.dueDay || 5);
    setNotes(item.notes || '');
    setIsAddModalOpen(true);
  };

  const parseNum = (v: any) => {
    const clean = String(v).replace(/[^0-9.-]+/g, '');
    const n = parseFloat(clean);
    return isNaN(n) ? 0 : n;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lenderName.trim() || totalAmount === '') return;

    const parsedTotal = parseNum(totalAmount);
    const parsedRepaid = parseNum(amountRepaid);
    const parsedEMI = monthlyEMI !== '' ? parseNum(monthlyEMI) : undefined;
    const parsedDueDay = dueDay !== '' ? parseNum(dueDay) : undefined;

    if (editingItem) {
      updateDebt(editingItem.id, {
        lenderName: lenderName.trim(),
        type,
        totalAmount: parsedTotal,
        amountRepaid: parsedRepaid,
        monthlyEMI: parsedEMI,
        dueDay: parsedDueDay,
        notes: notes || undefined
      });
    } else {
      addDebt({
        lenderName: lenderName.trim(),
        type,
        totalAmount: parsedTotal,
        amountRepaid: parsedRepaid,
        monthlyEMI: parsedEMI,
        dueDay: parsedDueDay,
        notes: notes || undefined
      });
    }

    setIsAddModalOpen(false);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmt = parseNum(paymentAmount);
    if (!paymentItem || parsedAmt <= 0) return;

    recordDebtPayment(paymentItem.id, parsedAmt);
    setPaymentItem(null);
    setPaymentAmount('');
  };

  const totalMonthlyEMIs = debts
    .filter(d => d.status !== 'closed')
    .reduce((sum, d) => sum + (Number(d.monthlyEMI) || 0), 0);

  const getTypeLabel = (t: DebtLoan['type']) => {
    switch (t) {
      case 'personal_loan': return 'Personal Loan';
      case 'home_loan': return 'Home Loan';
      case 'car_bike_loan': return 'Car/Bike Loan';
      case 'credit_card': return 'Credit Card Outstanding';
      case 'borrowed_friend_family': return 'Borrowed from Friends/Family';
      default: return 'Other Debt';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Debts & Loans (Payables)</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/40 font-semibold">
              {debts.length} Liabilities
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track bank loans, credit card balances, and borrowed amounts to know exactly how much you owe and monthly commitments.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Total Outstanding:</span>
            <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
              {formatCurrency(survivalAnalysis.totalPayables)}
            </span>
          </div>
          <button
            onClick={openAddModal}
            className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Debt/Loan</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Borrowed</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {formatCurrency(debts.reduce((sum, d) => sum + d.totalAmount, 0))}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Monthly Total EMI</p>
            <p className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
              {formatCurrency(totalMonthlyEMIs)}/mo
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Repaid So Far</p>
            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {formatCurrency(debts.reduce((sum, d) => sum + d.amountRepaid, 0))}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Debt List Cards */}
      <div className="space-y-4">
        {debts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3 shadow-sm">
            <CreditCard className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
            <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">No Active Debts or Loans</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              If you have any bank EMIs or personal borrowings, track them here.
            </p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-500 transition shadow-sm"
            >
              + Add Debt/Loan
            </button>
          </div>
        ) : (
          debts.map(item => {
            const isClosed = item.remainingAmount === 0;
            const repaidPercent = item.totalAmount > 0 
              ? Math.min(100, Math.round((item.amountRepaid / item.totalAmount) * 100))
              : 0;

            return (
              <div 
                key={item.id} 
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-3xl p-5 shadow-sm hover:shadow transition"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-slate-800 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold border border-purple-100 dark:border-slate-700">
                        {item.type === 'borrowed_friend_family' ? (
                          <Users className="w-5 h-5" />
                        ) : (
                          <Landmark className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 dark:text-white text-base">{item.lenderName}</h3>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-slate-200 dark:border-purple-500/20">
                            {getTypeLabel(item.type)}
                          </span>
                          {isClosed && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                              ✓ Closed
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.monthlyEMI && (
                            <span className="text-amber-600 dark:text-amber-400 font-bold">
                              Monthly EMI: {formatCurrency(item.monthlyEMI)}
                            </span>
                          )}
                          {item.dueDay && (
                            <span>• Due day {item.dueDay} of each month</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl mt-2 inline-block border border-slate-100 dark:border-transparent">
                        Notes: {item.notes}
                      </p>
                    )}
                  </div>

                  {/* Financial Figures & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className="text-left md:text-right">
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Outstanding:</div>
                      <div className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
                        {formatCurrency(item.remainingAmount)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Total: {formatCurrency(item.totalAmount)} (Paid: {formatCurrency(item.amountRepaid)})
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isClosed && (
                        <button
                          onClick={() => {
                            setPaymentItem(item);
                            setPaymentAmount(item.monthlyEMI || item.remainingAmount);
                          }}
                          className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow-sm"
                          title="Record payment or EMI paid"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          <span>Record EMI</span>
                        </button>
                      )}

                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Edit Record"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Remove record for ${item.lenderName}?`)) {
                            deleteDebt(item.id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-3 text-xs">
                  <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full transition-all duration-300"
                      style={{ width: `${repaidPercent}%` }}
                    />
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] shrink-0 font-medium">
                    {repaidPercent}% Repaid
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Debt Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              {editingItem ? 'Edit Debt / Loan' : 'Add Debt or Loan'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Lender or Bank Name</label>
                <input
                  type="text"
                  required
                  value={lenderName}
                  onChange={(e) => setLenderName(e.target.value)}
                  placeholder="e.g. HDFC Bike Loan, Uncle, Credit Card"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Debt Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white focus:border-indigo-500 outline-none"
                >
                  <option value="personal_loan">Personal Loan</option>
                  <option value="car_bike_loan">Vehicle / Two-Wheeler Loan</option>
                  <option value="home_loan">Home Loan</option>
                  <option value="credit_card">Credit Card Outstanding</option>
                  <option value="borrowed_friend_family">Borrowed from Friends / Family</option>
                  <option value="other">Other Debt</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Principal (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="₹ 50,000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Already Repaid (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={amountRepaid}
                    onChange={(e) => setAmountRepaid(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="₹ 0"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Monthly EMI</label>
                  <input
                    type="number"
                    min={0}
                    value={monthlyEMI}
                    onChange={(e) => setMonthlyEMI(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="₹ 3,500"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Due Day (1-31)</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={dueDay}
                    onChange={(e) => setDueDay(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="5"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. 12 months EMI tenure remaining..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white focus:border-indigo-500 outline-none"
                />
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
                  {editingItem ? 'Save Changes' : 'Save Loan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Debt Payment Modal */}
      {paymentItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setPaymentItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">Record Repayment</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              How much did you pay towards <strong>{paymentItem.lenderName}</strong>? (Remaining: {formatCurrency(paymentItem.remainingAmount)})
            </p>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Payment Amount (₹)</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={paymentItem.remainingAmount}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder={`₹ ${paymentItem.monthlyEMI || paymentItem.remainingAmount}`}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-indigo-500 rounded-xl text-lg font-bold text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              {paymentItem.monthlyEMI && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentAmount(paymentItem.monthlyEMI!)}
                    className="flex-1 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
                  >
                    Monthly EMI ({formatCurrency(paymentItem.monthlyEMI)})
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentItem(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition shadow-sm"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
