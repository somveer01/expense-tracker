import React from 'react';
import { Clock, Sparkles, ArrowRight, Wallet, TrendingDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface MiniRunwayBannerProps {
  setActiveTab?: (tab: string) => void;
  onOpenSimulator?: () => void;
}

export const MiniRunwayBanner: React.FC<MiniRunwayBannerProps> = ({ 
  setActiveTab,
  onOpenSimulator 
}) => {
  const { survivalAnalysis, accounts } = useApp();

  const formatCurrency = (amt: number) => '₹' + amt.toLocaleString('en-IN');

  if (accounts.length === 0) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-50/90 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 border border-indigo-200/70 dark:border-slate-800 p-2.5 sm:p-3 shadow-xs mb-4 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Left: Runway headline */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/40 text-[10px] font-bold">
              <Clock className="w-3 h-3 text-indigo-500 shrink-0" />
              <span>Survival Runway</span>
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Until <strong className="text-slate-800 dark:text-slate-200 font-semibold">{survivalAnalysis.runwayDate}</strong>
            </span>
          </div>

          <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-baseline flex-wrap gap-1.5">
            <span className="text-indigo-600 dark:text-indigo-400">
              {survivalAnalysis.monthsRemaining} months {survivalAnalysis.daysRemaining} days
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              (Lean: {survivalAnalysis.essentialMonthsRemaining}m {survivalAnalysis.essentialDaysRemaining}d)
            </span>
          </div>
        </div>

        {/* Right: Quick metrics pill & Action */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center gap-2.5 bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 px-3 py-1.5 rounded-xl text-xs">
            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
              <Wallet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-slate-500 hidden xs:inline">Capital:</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(survivalAnalysis.totalCapital)}</strong>
            </div>

            <div className="h-3 w-px bg-slate-200 dark:bg-slate-700" />

            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
              <TrendingDown className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
              <span className="text-slate-500 hidden xs:inline">Burn:</span>
              <strong className="text-rose-600 dark:text-rose-400 font-bold">{formatCurrency(survivalAnalysis.monthlyBurnRate)}/mo</strong>
            </div>
          </div>

          {onOpenSimulator && (
            <button
              onClick={onOpenSimulator}
              className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm transition"
              title="What-If Simulator"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Simulator</span>
            </button>
          )}

          {setActiveTab && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 border border-slate-200 dark:border-slate-700 transition"
              title="View Full Dashboard"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
