import React from 'react';
import { 
  ShieldAlert, 
  Wallet, 
  TrendingDown, 
  CreditCard, 
  HandCoins, 
  Sparkles, 
  PlusCircle, 
  CheckCircle2, 
  ArrowUpRight, 
  Clock, 
  HeartHandshake,
  Info,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
  onOpenSimulator: () => void;
  onOpenAddExpense: () => void;
  onOpenAddAccount: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  setActiveTab, 
  onOpenSimulator,
  onOpenAddExpense,
  onOpenAddAccount
}) => {
  const { survivalAnalysis, selectedMonth, accounts, moneyLent, debts, dailyExpenses } = useApp();

  const formatCurrency = (amt: number) => {
    return '₹' + amt.toLocaleString('en-IN');
  };

  const currentMonthExpenses = dailyExpenses.filter(e => e.date.startsWith(selectedMonth));
  const budgetUtilization = survivalAnalysis.monthlyBurnRate > 0 
    ? Math.min(100, Math.round((survivalAnalysis.actualSpentThisMonth / survivalAnalysis.monthlyBurnRate) * 100))
    : 0;

  const receivableRunwayGainDays = survivalAnalysis.monthlyBurnRate > 0 
    ? Math.round((survivalAnalysis.totalReceivables / (survivalAnalysis.monthlyBurnRate / 30)))
    : 0;

  // Days left in current month for daily budget allowance
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  const remainingDaysInMonth = Math.max(1, daysInMonth - currentDay + 1);
  const remainingBudget = Math.max(0, survivalAnalysis.monthlyBurnRate - survivalAnalysis.actualSpentThisMonth);
  const safeDailyAllowance = Math.round(remainingBudget / remainingDaysInMonth);

  // Health status determination
  const isHealthyRunway = survivalAnalysis.monthsRemaining >= 6;
  const isModerateRunway = survivalAnalysis.monthsRemaining >= 3 && survivalAnalysis.monthsRemaining < 6;
  const isCriticalRunway = survivalAnalysis.monthsRemaining < 3 && survivalAnalysis.totalCapital > 0;

  return (
    <div className="space-y-6">
      {/* 1. Onboarding / Blank Slate State (If all data cleared) */}
      {accounts.length === 0 ? (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50/90 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 border border-indigo-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-sm">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Blank Slate Ready • Follow 3 Simple Steps</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Calculate Your Layoff Survival Runway
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Find out exactly how many days and months your remaining money will last without an active salary. Start by entering your accounts and budget:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <button
                onClick={() => {
                  setActiveTab('accounts');
                  onOpenAddAccount();
                }}
                className="p-4 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-2xl flex flex-col justify-between text-left transition group shadow-sm hover:shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mb-3 group-hover:scale-105 transition">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-xs sm:text-sm text-slate-900 dark:text-white font-bold">1. Add Capital</strong>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Bank accounts & cash in hand</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('budget')}
                className="p-4 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-2xl flex flex-col justify-between text-left transition group shadow-sm hover:shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mb-3 group-hover:scale-105 transition">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-xs sm:text-sm text-slate-900 dark:text-white font-bold">2. Set Budget</strong>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Rent, food & essential bills</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('expenses');
                  onOpenAddExpense();
                }}
                className="p-4 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-2xl flex flex-col justify-between text-left transition group shadow-sm hover:shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mb-3 group-hover:scale-105 transition">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-xs sm:text-sm text-slate-900 dark:text-white font-bold">3. Track Daily Spend</strong>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Deduct expenses on the go</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 2. Hero Survival Runway Master Card */
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50/90 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 border border-indigo-100 dark:border-slate-800 p-5 sm:p-8 shadow-sm">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 w-full">
            <div className="space-y-3 max-w-xl">
              {/* Status Indicator Chip */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  isHealthyRunway
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40'
                    : isModerateRunway
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/40'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/40'
                }`}>
                  {isHealthyRunway ? <ShieldCheck className="w-3.5 h-3.5" /> : isModerateRunway ? <Zap className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  <span>
                    {isHealthyRunway ? 'Safe Runway (6+ Months)' : isModerateRunway ? 'Moderate Runway (3-6 Months)' : 'Urgent Runway (<3 Months)'}
                  </span>
                </span>

                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Until <strong className="text-slate-900 dark:text-white font-bold">{survivalAnalysis.runwayDate}</strong>
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                <span className="text-indigo-600 dark:text-indigo-400">
                  {survivalAnalysis.monthsRemaining} Months {survivalAnalysis.daysRemaining} Days
                </span>{' '}
                of survival runway
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                At your declared burn rate of <strong className="text-slate-900 dark:text-white font-bold">{formatCurrency(survivalAnalysis.monthlyBurnRate)}/mo</strong>, your liquid capital of <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(survivalAnalysis.totalCapital)}</strong> guarantees your finances through <span className="font-semibold text-slate-900 dark:text-white underline decoration-indigo-400 underline-offset-4">{survivalAnalysis.runwayDate}</span>.
              </p>
            </div>

            {/* Quick Metrics & Essential Lean Comparison */}
            <div className="w-full lg:w-auto bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col gap-3.5 lg:min-w-[300px]">
              {/* Essential Lean Mode */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Strict Lean Mode (Essentials):
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {survivalAnalysis.essentialMonthsRemaining}m {survivalAnalysis.essentialDaysRemaining}d
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Cutting non-essentials buys you time until <strong className="text-slate-800 dark:text-slate-200">{survivalAnalysis.runwayDateEssential}</strong>.
                </p>
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-700" />

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAddExpense}
                  className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Expense</span>
                </button>

                <button
                  onClick={onOpenSimulator}
                  className="flex-1 py-2.5 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-650 active:scale-[0.98] text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition border border-slate-200 dark:border-slate-600"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                  <span>Simulator</span>
                </button>
              </div>
            </div>
          </div>

          {/* Actionable Insights Strip */}
          {survivalAnalysis.totalReceivables > 0 && (
            <div className="mt-6 pt-4 border-t border-indigo-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-indigo-50/50 dark:bg-slate-800/40 -mx-5 sm:-mx-8 -mb-5 sm:-mb-8 px-5 sm:px-8 py-3.5">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <HeartHandshake className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  <strong>Runway Extension Opportunity:</strong> You have lent <strong>{formatCurrency(survivalAnalysis.totalReceivables)}</strong>. Recovering it will extend your runway by <strong className="text-indigo-600 dark:text-amber-300 font-bold">+{receivableRunwayGainDays} days</strong>!
                </span>
              </div>
              <button
                onClick={() => setActiveTab('lent')}
                className="text-indigo-600 dark:text-amber-400 hover:underline font-bold flex items-center gap-1 whitespace-nowrap"
              >
                Collect Money →
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. Four Core Financial Pillar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Capital */}
        <div 
          onClick={() => setActiveTab('accounts')} 
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 rounded-3xl p-5 cursor-pointer transition-all duration-200 group shadow-sm hover:shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Liquid Capital</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(survivalAnalysis.totalCapital)}
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span>{accounts.length} Accounts & Cash</span>
            <span className="text-emerald-600 dark:text-emerald-400 group-hover:underline flex items-center gap-0.5 font-semibold">
              Manage <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* 2. Monthly Burn */}
        <div 
          onClick={() => setActiveTab('budget')} 
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-600 rounded-3xl p-5 cursor-pointer transition-all duration-200 group shadow-sm hover:shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Monthly Burn Rate</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-105 transition">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(survivalAnalysis.monthlyBurnRate)}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">/mo</span>
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span>Daily: ~{formatCurrency(Math.round(survivalAnalysis.monthlyBurnRate / 30))}/day</span>
            <span className="text-rose-600 dark:text-rose-400 group-hover:underline flex items-center gap-0.5 font-semibold">
              Adjust <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* 3. Receivables */}
        <div 
          onClick={() => setActiveTab('lent')} 
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 rounded-3xl p-5 cursor-pointer transition-all duration-200 group shadow-sm hover:shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Money Lent (Receivables)</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition">
              <HandCoins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(survivalAnalysis.totalReceivables)}
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span>{moneyLent.filter(m => m.status !== 'fully_settled').length} Active Borrowers</span>
            <span className="text-amber-600 dark:text-amber-400 group-hover:underline flex items-center gap-0.5 font-semibold">
              Recover <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* 4. Debts */}
        <div 
          onClick={() => setActiveTab('debts')} 
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 rounded-3xl p-5 cursor-pointer transition-all duration-200 group shadow-sm hover:shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Debts & EMIs (Payables)</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(survivalAnalysis.totalPayables)}
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span>{debts.filter(d => d.status !== 'closed').length} Active Liabilities</span>
            <span className="text-purple-600 dark:text-purple-400 group-hover:underline flex items-center gap-0.5 font-semibold">
              View EMIs <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* 4. Main Spending Progress & Recent Expenses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Spending Progress */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Spending Progress • {selectedMonth}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live comparison of daily expenses recorded against your declared budget
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('budget')}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-xl transition"
              >
                Edit Budget
              </button>
              <button
                onClick={onOpenAddExpense}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-xl transition flex items-center gap-1 shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Expense</span>
              </button>
            </div>
          </div>

          {/* Progress Bar & Burn Metrics */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Spent So Far: <strong className="text-slate-900 dark:text-white text-sm font-bold">{formatCurrency(survivalAnalysis.actualSpentThisMonth)}</strong>
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                Declared Budget: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{formatCurrency(survivalAnalysis.monthlyBurnRate)}</strong> ({budgetUtilization}%)
              </span>
            </div>

            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/80 dark:border-slate-700">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  budgetUtilization > 90 ? 'bg-rose-500' :
                  budgetUtilization > 75 ? 'bg-amber-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${Math.min(100, budgetUtilization)}%` }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-500 block">Remaining Monthly Budget:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                  {formatCurrency(remainingBudget)}
                </strong>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-500 block">Recommended Daily Spend:</span>
                <strong className="text-indigo-600 dark:text-indigo-400 text-sm font-bold">
                  ~{formatCurrency(safeDailyAllowance)}/day
                </strong>
                <span className="text-[10px] text-slate-400 ml-1">({remainingDaysInMonth} days left)</span>
              </div>
            </div>
          </div>

          {/* Bank Accounts Distribution Preview */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Bank Accounts & Cash Reserves
              </h3>
              <button 
                onClick={() => setActiveTab('accounts')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                All Accounts →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {accounts.map(acc => (
                <div key={acc.id} className="p-3.5 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-white truncate">{acc.bankName}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200/60 dark:border-transparent rounded-lg">
                      {acc.accountType}
                    </span>
                  </div>
                  <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(acc.balance)}
                  </div>
                  {acc.accountNumberLast4 && (
                    <div className="text-[10px] text-slate-400">
                      •••• {acc.accountNumberLast4}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Recent Daily Expenses */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recent Daily Expenses</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Latest entries this month</p>
            </div>
            <button
              onClick={() => setActiveTab('expenses')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              View All →
            </button>
          </div>

          {currentMonthExpenses.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs space-y-2">
              <Info className="w-6 h-6 mx-auto opacity-50" />
              <p>No daily expenses recorded for this month yet</p>
              <button
                onClick={onOpenAddExpense}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                + Add First Expense
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {currentMonthExpenses.slice(0, 5).map(exp => (
                <div key={exp.id} className="p-2.5 bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-2xl flex items-center justify-between text-xs">
                  <div className="space-y-0.5 max-w-[65%]">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{exp.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{exp.categoryName}</p>
                    <span className="text-[10px] text-slate-400">{exp.date}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-rose-600 dark:text-rose-400">
                      -{formatCurrency(exp.amount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Layoff Checklist */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 dark:text-slate-300">💡 Layoff Survival Checklist:</h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-[11px]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Pause non-essential gym & streaming subscriptions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Follow up on money lent to friends / colleagues</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Explore moratorium or EMI restructuring with banks</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};