import React, { useState } from 'react';
import { 
  HandCoins, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowDownLeft, 
  Calendar, 
  User, 
  CheckCircle2, 
  Phone, 
  X, 
  Clock 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MoneyLent } from '../types';

export const MoneyLentManager: React.FC = () => {
  const { moneyLent, addMoneyLent, recordLentRepayment, updateMoneyLent, deleteMoneyLent, survivalAnalysis } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MoneyLent | null>(null);

  // Form State
  const [borrowerName, setBorrowerName] = useState('');
  const [totalAmount, setTotalAmount] = useState<number | ''>('');
  const [amountReceived, setAmountReceived] = useState<number | ''>(0);
  const [lentDate, setLentDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Repayment Modal
  const [repaymentItem, setRepaymentItem] = useState<MoneyLent | null>(null);
  const [repaymentAmount, setRepaymentAmount] = useState<number | ''>('');

  const formatCurrency = (amt: number) => '₹' + amt.toLocaleString('en-IN');

  const openAddModal = () => {
    setEditingItem(null);
    setBorrowerName('');
    setTotalAmount('');
    setAmountReceived(0);
    setLentDate(new Date().toISOString().split('T')[0]);
    setExpectedReturnDate('');
    setPhone('');
    setNotes('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (item: MoneyLent) => {
    setEditingItem(item);
    setBorrowerName(item.borrowerName);
    setTotalAmount(item.totalAmount);
    setAmountReceived(item.amountReceived);
    setLentDate(item.lentDate);
    setExpectedReturnDate(item.expectedReturnDate || '');
    setPhone(item.phone || '');
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
    if (!borrowerName.trim() || totalAmount === '') return;

    const parsedTotal = parseNum(totalAmount);
    const parsedReceived = parseNum(amountReceived);

    if (editingItem) {
      updateMoneyLent(editingItem.id, {
        borrowerName: borrowerName.trim(),
        totalAmount: parsedTotal,
        amountReceived: parsedReceived,
        lentDate,
        expectedReturnDate: expectedReturnDate || undefined,
        phone: phone || undefined,
        notes: notes || undefined
      });
    } else {
      addMoneyLent({
        borrowerName: borrowerName.trim(),
        totalAmount: parsedTotal,
        amountReceived: parsedReceived,
        lentDate,
        expectedReturnDate: expectedReturnDate || undefined,
        phone: phone || undefined,
        notes: notes || undefined
      });
    }

    setIsAddModalOpen(false);
  };

  const handleRecordRepayment = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmt = parseNum(repaymentAmount);
    if (!repaymentItem || parsedAmt <= 0) return;

    recordLentRepayment(repaymentItem.id, parsedAmt);
    setRepaymentItem(null);
    setRepaymentAmount('');
  };

  const totalOriginalLent = moneyLent.reduce((acc, m) => acc + m.totalAmount, 0);
  const totalReceivedBack = moneyLent.reduce((acc, m) => acc + m.amountReceived, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Money Lent (Receivables)</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/40 font-semibold">
              {moneyLent.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track money lent to friends or colleagues. Recovering this capital directly extends your layoff survival runway!
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Pending Collection:</span>
            <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
              {formatCurrency(survivalAnalysis.totalReceivables)}
            </span>
          </div>
          <button
            onClick={openAddModal}
            className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Record</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Lent</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{formatCurrency(totalOriginalLent)}</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            <HandCoins className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Repaid So Far</p>
            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{formatCurrency(totalReceivedBack)}</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Remaining to Collect</p>
            <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{formatCurrency(survivalAnalysis.totalReceivables)}</p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Lent List Cards */}
      <div className="space-y-4">
        {moneyLent.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3 shadow-sm">
            <HandCoins className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
            <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">No Lent Records Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              If you have lent money to friends or colleagues, record it here to track recoveries.
            </p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-500 transition shadow-sm"
            >
              + Add Record
            </button>
          </div>
        ) : (
          moneyLent.map(item => {
            const recoveryPercent = item.totalAmount > 0 
              ? Math.min(100, Math.round((item.amountReceived / item.totalAmount) * 100))
              : 0;
            const isSettled = item.remainingAmount === 0;

            return (
              <div 
                key={item.id} 
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-3xl p-5 shadow-sm hover:shadow transition"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-slate-800 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold border border-amber-100 dark:border-slate-700">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 dark:text-white text-base">{item.borrowerName}</h3>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isSettled 
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40'
                              : item.amountReceived > 0 
                              ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40'
                              : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40'
                          }`}>
                            {isSettled ? '✓ Fully Settled' : item.amountReceived > 0 ? 'Partially Paid' : 'Pending'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <span>Lent: {item.lentDate}</span>
                          {item.expectedReturnDate && (
                            <span>• Due: {item.expectedReturnDate}</span>
                          )}
                          {item.phone && (
                            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                              <Phone className="w-3 h-3 text-slate-400" /> {item.phone}
                            </span>
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
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Remaining to Collect:</div>
                      <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
                        {formatCurrency(item.remainingAmount)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Total: {formatCurrency(item.totalAmount)} (Recv: {formatCurrency(item.amountReceived)})
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isSettled && (
                        <button
                          onClick={() => {
                            setRepaymentItem(item);
                            setRepaymentAmount(item.remainingAmount);
                          }}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow-sm"
                          title="Record payment received"
                        >
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                          <span>Receive</span>
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
                          if (confirm(`Remove record for ${item.borrowerName}?`)) {
                            deleteMoneyLent(item.id);
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
                      className={`h-full rounded-full transition-all duration-300 ${isSettled ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${recoveryPercent}%` }}
                    />
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] shrink-0 font-medium">
                    {recoveryPercent}% Recovered
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Lent Modal */}
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
              {editingItem ? 'Edit Lent Record' : 'Record Money Lent'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Borrower's Name</label>
                <input
                  type="text"
                  required
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  placeholder="e.g. Ramesh (Friend)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Lent (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="₹ 20,000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Already Repaid (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="₹ 0"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Date Lent</label>
                  <input
                    type="date"
                    required
                    value={lentDate}
                    onChange={(e) => setLentDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Expected Return</label>
                  <input
                    type="date"
                    value={expectedReturnDate}
                    onChange={(e) => setExpectedReturnDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number (Optional)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98XXXXXXXX"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Lent for emergency expenses..."
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
                  {editingItem ? 'Save Changes' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Repayment Modal */}
      {repaymentItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setRepaymentItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">Record Payment Received</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              How much did <strong>{repaymentItem.borrowerName}</strong> pay back? (Remaining: {formatCurrency(repaymentItem.remainingAmount)})
            </p>

            <form onSubmit={handleRecordRepayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Amount Received (₹)</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={repaymentItem.remainingAmount}
                  value={repaymentAmount}
                  onChange={(e) => setRepaymentAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder={`Max ${repaymentItem.remainingAmount}`}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-indigo-500 rounded-xl text-lg font-bold text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRepaymentAmount(repaymentItem.remainingAmount)}
                  className="flex-1 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
                >
                  Full Balance ({formatCurrency(repaymentItem.remainingAmount)})
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRepaymentItem(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition shadow-sm"
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
