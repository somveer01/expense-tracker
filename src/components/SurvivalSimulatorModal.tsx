import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Lightbulb,
  ArrowRight,
  TrendingDown,
  HandCoins,
  ShieldAlert,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SurvivalSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SurvivalSimulatorModal: React.FC<SurvivalSimulatorModalProps> = ({ isOpen, onClose }) => {
  const { survivalAnalysis } = useApp();

  const [monthlyExpenseCut, setMonthlyExpenseCut] = useState<number>(5000);
  const [recoverReceivables, setRecoverReceivables] = useState<boolean>(true);

  if (!isOpen) return null;

  const currentCapital = survivalAnalysis.totalCapital;
  const currentBurn = survivalAnalysis.monthlyBurnRate || 1;

  // Simulated figures
  const effectiveCapital = currentCapital + (recoverReceivables ? survivalAnalysis.totalReceivables : 0);
  const simulatedBurn = Math.max(1000, currentBurn - monthlyExpenseCut);

  const simulatedDays = Math.floor(effectiveCapital / (simulatedBurn / 30));
  const simulatedMonths = Math.floor(simulatedDays / 30);
  const simulatedDaysRemainder = simulatedDays % 30;

  const originalDays = Math.floor(currentCapital / (currentBurn / 30));
  const gainedDays = Math.max(0, simulatedDays - originalDays);
  const gainedMonths = Math.floor(gainedDays / 30);
  const gainedDaysRemainder = gainedDays % 30;

  const formatCurrency = (amt: number) => '₹' + amt.toLocaleString('en-IN');

  const calcTargetDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-slate-100 transition-colors">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Layoff Survival Simulator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive What-If analysis: see how much extra runway you gain by cutting costs or collecting lent money.
            </p>
          </div>
        </div>

        {/* Big Impact Comparison Card */}
        <div className="bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 dark:from-slate-800/80 dark:via-slate-800/50 dark:to-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/50 rounded-2xl p-5 mb-6 shadow-sm">
          <div className="grid grid-cols-2 gap-4 text-center">
            {/* Current */}
            <div className="space-y-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
                Current Runway
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-700 dark:text-slate-300">
                {survivalAnalysis.monthsRemaining}m {survivalAnalysis.daysRemaining}d
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Burn: {formatCurrency(currentBurn)}/mo
              </p>
            </div>

            {/* Simulated */}
            <div className="space-y-1 border-l border-slate-200 dark:border-slate-700/80 pl-4">
              <span className="text-[11px] text-indigo-600 dark:text-amber-400 uppercase font-bold tracking-wider flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" />
                Simulated Runway
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {simulatedMonths}m {simulatedDaysRemainder}d
              </div>
              <div className="inline-block text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                +{gainedMonths}m {gainedDaysRemainder}d Extra Time
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-700/80 text-center text-xs text-slate-600 dark:text-slate-300 flex items-center justify-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>
              New Estimated Exhaustion Date: <strong className="text-indigo-600 dark:text-amber-400 font-bold">{calcTargetDate(simulatedDays)}</strong>
            </span>
          </div>
        </div>

        {/* Simulator Controls */}
        <div className="space-y-4">
          {/* Slider: Monthly Expense Cut */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-rose-500" />
                <span>Monthly Spending Cut:</span>
              </label>
              <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                -{formatCurrency(monthlyExpenseCut)}/mo
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={Math.min(50000, Math.max(10000, currentBurn - 2000))}
              step={1000}
              value={monthlyExpenseCut}
              onChange={(e) => setMonthlyExpenseCut(Number(e.target.value))}
              className="w-full accent-indigo-600 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer h-2"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>₹0 (No cuts)</span>
              <span>-₹{Math.min(50000, Math.max(10000, currentBurn - 2000)).toLocaleString('en-IN')} (Aggressive Lean)</span>
            </div>
          </div>

          {/* Toggle: Recover Lent Money */}
          {survivalAnalysis.totalReceivables > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200/60 dark:border-amber-800/40">
                  <HandCoins className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Recover Money Lent to Others
                  </span>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                    +{formatCurrency(survivalAnalysis.totalReceivables)} pending collection
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={recoverReceivables}
                onChange={(e) => setRecoverReceivables(e.target.checked)}
                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
              />
            </div>
          )}

          {/* Tips for Layoff period */}
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 rounded-2xl text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Layoff Pro Tip:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              Canceling unused gym/OTT subscriptions and switching to home-cooked meals can easily extend your financial runway by 2 to 3 months.
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-6 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-semibold rounded-xl text-xs transition shadow-sm"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
};