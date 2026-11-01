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
  Info
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
  onOpenAddExpense
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

  return (
    <div className="space-y-6">
      {/* Hero Survival Runway Banner (Soothing, Eye-Friendly Design) */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-50/90 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 border border-indigo-100 dark:border-slate-800 p-4 sm:p-8 shadow-sm w-full max-w-full">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 min-w-0 w-full">
          <div className="space-y-3 max-w-xl min-w-0 w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/40 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>Job Search Emergency Runway</span>
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight break-words">
              You have <span className="text-indigo-600 dark:text-amber-400">{survivalAnalysis.monthsRemaining} months {survivalAnalysis.daysRemaining} days</span> of survival runway left
            </h1>

            <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed break-words">
              Based on your declared monthly burn rate ({formatCurrency(survivalAnalysis.monthlyBurnRate)}/mo), your liquid capital of <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(survivalAnalysis.totalCapital)}</strong> will last until{' '}
              <span className="font-semibold text-slate-900 dark:text-white underline decoration-indigo-400 dark:decoration-amber-400 underline-offset-4">
                {survivalAnalysis.runwayDate}
              </span>.
            </p>
          </div>

          {/* Quick Metrics Badge Card */}
          <div className="w-full lg:w-auto bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row lg:flex-col gap-4 sm:min-w-[280px]">
            {/* Essential Only Mode */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Strict Lean Survival:
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {survivalAnalysis.essentialMonthsRemaining}m {survivalAnalysis.essentialDaysRemaining}d
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Cutting non-essentials extends your money until <strong className="text-slate-800 dark:text-slate-200">{survivalAnalysis.runwayDateEssential}</strong>.
              </p>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-700" />

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenSimulator}
                className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulator</span>
              </button>
              <button
                onClick={onOpenAddExpense}
                className="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition border border-slate-200 dark:border-slate-600"
              >
                <PlusCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-amber-400" />
                <span>Add Expense</span>
              </button>
            </div>
          </div>
        </div>

        {/* Layoff Actionable Insights */}
        {survivalAnalysis.totalReceivables > 0 && (
          <div className="mt-6 pt-4 border-t border-indigo-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-indigo-50/40 dark:bg-slate-800/40 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 px-6 sm:px-8 py-3.5">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <HeartHandshake className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                <strong>Actionable Opportunity:</strong> You have lent <strong>{formatCurrency(survivalAnalysis.totalReceivables)}</strong> to others. Recovering this will extend your runway by <strong className="text-indigo-600 dark:text-amber-300 font-bold">+{receivableRunwayGainDays} days</strong>!
              </span>
            </div>
            <button
              onClick={() => setActiveTab('lent')}
              className="text-indigo-600 dark:text-amber-400 hover:underline font-semibold flex items-center gap-1 whitespace-nowrap"
            >
              View Receivables →
            </button>
          </div>
        )}
      </div>

      {/* 4 Financial Pillar Summary Cards (Clean, Soothing Pastels) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Liquid Capital */}
        <div 
          onClick={() => setActiveTab('accounts')} 
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 rounded-3xl p-5 cursor-pointer transition-all duration-200 group shadow-sm hover:shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Liquid Capital</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(survivalAnalysis.totalCapital)}
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span>{accounts.length} Accounts (PNB, HDFC, Cash)</span>
            <span className="text-emerald-600 dark:text-emerald-400 group-hover:underline flex items-center gap-0.5 font-medium">
              Manage <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* 2. Monthly Burn Rate */}
        <div 
          onClick={() => setActiveTab('budget')} 
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-700 rounded-3xl p-5 cursor-pointer transition-all duration-200 group shadow-sm hover:shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Monthly Burn Rate</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-105 transition">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(survivalAnalysis.monthlyBurnRate)}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">/mo</span>
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span>Daily: ~{formatCurrency(Math.round(survivalAnalysis.monthlyBurnRate / 30))}/day</span>
            <span className="text-rose-600 dark:text-rose-400 group-hover:underline flex items-center gap-0.5 font-medium">
              Adjust <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* 3. Money Lent (Receivables) */}
        <div 
          onClick={() => setActiveTab('lent')} 
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 rounded-3xl p-5 cursor-pointer transition-all duration-200 group shadow-sm hover:shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Money Lent (Receivables)</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition">
              <HandCoins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(survivalAnalysis.totalReceivables)}
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span>{moneyLent.filter(m => m.status !== 'fully_settled').length} Active Borrowers</span>
            <span className="text-amber-600 dark:text-amber-400 group-hover:underline flex items-center gap-0.5 font-medium">
              Recover <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* 4. Total Debts & Loans (Payables) */}
        <div 
          onClick={() => setActiveTab('debts')} 
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 rounded-3xl p-5 cursor-pointer transition-all duration-200 group shadow-sm hover:shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Debts & Loans (Payables)</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(survivalAnalysis.totalPayables)}
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span>{debts.filter(d => d.status !== 'closed').length} Active Loans</span>
            <span className="text-purple-600 dark:text-purple-400 group-hover:underline flex items-center gap-0.5 font-medium">
              View EMIs <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Monthly Budget vs Actual & Recent Daily Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Planned vs Actual Spend Progress */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Month Spending Progress ({selectedMonth})</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Declared Budget vs Actual Daily Spend Tracked
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

            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/80 dark:border-slate-700">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  budgetUtilization > 90 ? 'bg-rose-500' :
                  budgetUtilization > 75 ? 'bg-amber-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${budgetUtilization}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>
                Remaining Budget This Month: <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">{formatCurrency(Math.max(0, survivalAnalysis.monthlyBurnRate - survivalAnalysis.actualSpentThisMonth))}</strong>
              </span>
              <span>
                {budgetUtilization > 100 ? (
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">⚠️ Exceeded declared budget!</span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Within declared budget limits</span>
                )}
              </span>
            </div>
          </div>

          {/* Bank Accounts Distribution Preview */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Liquid Bank Accounts & Balances
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {accounts.map(acc => (
                <div key={acc.id} className="p-3.5 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-white truncate">{acc.bankName}</span>
                    <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200/60 dark:border-transparent rounded">
                      {acc.accountType}
                    </span>
                  </div>
                  <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(acc.balance)}
                  </div>
                  {acc.accountNumberLast4 && (
                    <div className="text-[10px] text-slate-400">
                      Account ending: •••• {acc.accountNumberLast4}
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
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Pause unused subscriptions & streaming apps</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Politely follow up on pending money lent</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Request rent or EMI restructuring if necessary</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
