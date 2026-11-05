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

  return (
    <div className="space-y-4">
      {/* 1. Onboarding / Blank Slate State (If all data cleared) */}
      {accounts.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50/90 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 border border-indigo-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Blank Slate Ready • Follow 3 Simple Steps</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Calculate Your Layoff Survival Runway
            </h1>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Find out exactly how many days and months your remaining money will last without an active salary:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <button
                onClick={() => {
                  setActiveTab('accounts');
                  onOpenAddAccount();
                }}
                className="p-3 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-xl flex items-center gap-3 text-left transition group shadow-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-xs text-slate-900 dark:text-white font-bold">1. Add Capital</strong>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Banks & cash</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('budget')}
                className="p-3 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-xl flex items-center gap-3 text-left transition group shadow-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-xs text-slate-900 dark:text-white font-bold">2. Set Budget</strong>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Monthly bills</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('expenses');
                  onOpenAddExpense();
                }}
                className="p-3 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-xl flex items-center gap-3 text-left transition group shadow-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-xs text-slate-900 dark:text-white font-bold">3. Daily Spend</strong>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Deduct expenses</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 2. Compact Hero Survival Runway Card */
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50/90 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 border border-indigo-100 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
            <div className="space-y-1.5 max-w-xl">
              {/* Status Indicator Chip */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  isHealthyRunway
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40'
                    : isModerateRunway
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/40'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/40'
                }`}>
                  {isHealthyRunway ? <ShieldCheck className="w-3 h-3" /> : isModerateRunway ? <Zap className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  <span>
                    {isHealthyRunway ? 'Safe Runway (6+ Months)' : isModerateRunway ? 'Moderate Runway (3-6 Months)' : 'Urgent Runway (<3 Months)'}
                  </span>
                </span>

                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Lasts until <strong className="text-slate-900 dark:text-white font-bold">{survivalAnalysis.runwayDate}</strong>
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                <span className="text-indigo-600 dark:text-indigo-400">
                  {survivalAnalysis.monthsRemaining} Months {survivalAnalysis.daysRemaining} Days
                </span>{' '}
                runway left
              </h1>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Burn: <strong className="text-slate-900 dark:text-white font-bold">{formatCurrency(survivalAnalysis.monthlyBurnRate)}/mo</strong> • Liquid Capital: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(survivalAnalysis.totalCapital)}</strong>
              </p>
            </div>

            {/* Compact Actions & Lean Comparison */}
            <div className="w-full md:w-auto bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-3 shadow-xs flex flex-col gap-2.5 md:min-w-[260px]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Strict Lean Mode:
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {survivalAnalysis.essentialMonthsRemaining}m {survivalAnalysis.essentialDaysRemaining}d
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAddExpense}
                  className="flex-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Expense</span>
                </button>

                <button
                  onClick={onOpenSimulator}
                  className="flex-1 py-1.5 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-650 active:scale-[0.98] text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition border border-slate-200 dark:border-slate-600"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                  <span>Simulator</span>
                </button>
              </div>
            </div>
          </div>

          {/* Actionable Insights Bar */}
          {survivalAnalysis.totalReceivables > 0 && (
            <div className="mt-3 pt-2.5 border-t border-indigo-100 dark:border-slate-800 flex items-center justify-between gap-2 text-[11px] text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5 truncate">
                <HeartHandshake className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">
                  Money Lent: <strong>{formatCurrency(survivalAnalysis.totalReceivables)}</strong> gives you <strong className="text-indigo-600 dark:text-amber-300 font-bold">+{receivableRunwayGainDays} days</strong> runway!
                </span>
              </div>
              <button
                onClick={() => setActiveTab('lent')}
                className="text-indigo-600 dark:text-amber-400 hover:underline font-bold whitespace-nowrap shrink-0"
              >
                Recover →
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. Four Core Financial Pillar Cards (Small, Compact & Punchy) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {/* 1. Capital */}
        <div 
          onClick={() => setActiveTab('accounts')} 
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 rounded-2xl p-3 sm:p-3.5 cursor-pointer transition-all duration-150 group shadow-xs hover:shadow-sm"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">Liquid Capital</span>
            <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Wallet className="w-3 h-3" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight truncate">
            {formatCurrency(survivalAnalysis.totalCapital)}
          </div>
          <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
            <span>{accounts.length} Accounts</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold group-hover:underline flex items-center">
              Manage <ArrowUpRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>

        {/* 2. Monthly Burn */}
        <div 
          onClick={() => setActiveTab('budget')} 
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-600 rounded-2xl p-3 sm:p-3.5 cursor-pointer transition-all duration-150 group shadow-xs hover:shadow-sm"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">Monthly Burn</span>
            <div className="w-6 h-6 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <TrendingDown className="w-3 h-3" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight truncate">
            {formatCurrency(survivalAnalysis.monthlyBurnRate)}
          </div>
          <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
            <span>~{formatCurrency(Math.round(survivalAnalysis.monthlyBurnRate / 30))}/day</span>
            <span className="text-rose-600 dark:text-rose-400 font-bold group-hover:underline flex items-center">
              Adjust <ArrowUpRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>

        {/* 3. Receivables */}
        <div 
          onClick={() => setActiveTab('lent')} 
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 rounded-2xl p-3 sm:p-3.5 cursor-pointer transition-all duration-150 group shadow-xs hover:shadow-sm"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">Money Lent</span>
            <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <HandCoins className="w-3 h-3" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight truncate">
            {formatCurrency(survivalAnalysis.totalReceivables)}
          </div>
          <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
            <span>{moneyLent.filter(m => m.status !== 'fully_settled').length} Borrowers</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold group-hover:underline flex items-center">
              Collect <ArrowUpRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>

        {/* 4. Debts */}
        <div 
          onClick={() => setActiveTab('debts')} 
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 rounded-2xl p-3 sm:p-3.5 cursor-pointer transition-all duration-150 group shadow-xs hover:shadow-sm"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">Debts / EMIs</span>
            <div className="w-6 h-6 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-3 h-3" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight truncate">
            {formatCurrency(survivalAnalysis.totalPayables)}
          </div>
          <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
            <span>{debts.filter(d => d.status !== 'closed').length} Loans</span>
            <span className="text-purple-600 dark:text-purple-400 font-bold group-hover:underline flex items-center">
              View <ArrowUpRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      </div>

      {/* 4. Spending Progress & Bank Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Left 2 Cols: Monthly Spending Progress */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Spending Progress • {selectedMonth}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Daily expenses vs declared monthly budget
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('budget')}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 rounded-lg transition"
              >
                Budget
              </button>
              <button
                onClick={onOpenAddExpense}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-[11px] font-semibold text-white rounded-lg transition flex items-center gap-1 shadow-xs"
              >
                <PlusCircle className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Progress Bar & Burn Metrics */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Spent: <strong className="text-slate-900 dark:text-white font-bold">{formatCurrency(survivalAnalysis.actualSpentThisMonth)}</strong>
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                Budget: {formatCurrency(survivalAnalysis.monthlyBurnRate)} ({budgetUtilization}%)
              </span>
            </div>

            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/80 dark:border-slate-700">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  budgetUtilization > 90 ? 'bg-rose-500' :
                  budgetUtilization > 75 ? 'bg-amber-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${Math.min(100, budgetUtilization)}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-0.5">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">Remaining Budget:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold text-xs sm:text-sm">
                  {formatCurrency(remainingBudget)}
                </strong>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">Daily Allowance:</span>
                <strong className="text-indigo-600 dark:text-indigo-400 font-bold text-xs sm:text-sm">
                  ~{formatCurrency(safeDailyAllowance)}/d
                </strong>
                <span className="text-[9px] text-slate-400 ml-1">({remainingDaysInMonth}d left)</span>
              </div>
            </div>
          </div>

          {/* Bank Accounts Distribution Preview */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Liquid Accounts
              </h3>
              <button 
                onClick={() => setActiveTab('accounts')}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                View All →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {accounts.map(acc => (
                <div key={acc.id} className="p-2.5 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-xl space-y-0.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-white truncate text-[11px]">{acc.bankName}</span>
                    <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 px-1 py-0.2 bg-white dark:bg-slate-700 rounded">
                      {acc.accountType}
                    </span>
                  </div>
                  <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(acc.balance)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Recent Daily Expenses */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Recent Daily Expenses</h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Latest entries</p>
            </div>
            <button
              onClick={() => setActiveTab('expenses')}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              All →
            </button>
          </div>

          {currentMonthExpenses.length === 0 ? (
            <div className="py-6 text-center text-slate-400 text-xs space-y-1.5">
              <Info className="w-5 h-5 mx-auto opacity-50" />
              <p className="text-[11px]">No expenses recorded yet</p>
              <button
                onClick={onOpenAddExpense}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold text-xs"
              >
                + Add Expense
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {currentMonthExpenses.slice(0, 4).map(exp => (
                <div key={exp.id} className="p-2 bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-xl flex items-center justify-between text-xs">
                  <div className="space-y-0.5 max-w-[65%]">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate text-[11px]">{exp.title}</p>
                    <p className="text-[10px] text-slate-400 truncate">{exp.categoryName} • {exp.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-rose-600 dark:text-rose-400 text-xs">
                      -{formatCurrency(exp.amount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Layoff Checklist */}
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-[11px]">
            <h4 className="font-bold text-slate-800 dark:text-slate-300">💡 Quick Survival Tips:</h4>
            <ul className="space-y-1 text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>Pause unused recurring subscriptions</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>Recover pending receivables from friends</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};