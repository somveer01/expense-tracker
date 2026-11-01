import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Lightbulb
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Layoff Survival Simulator (What-If Analysis)</h2>
            <p className="text-xs text-slate-400">
              Calculate how cutting discretionary expenses or recovering lent money expands your job hunt timeline.
            </p>
          </div>
        </div>

        {/* Big Impact Comparison Card */}
        <div className="bg-gradient-to-br from-indigo-950/60 to-slate-850 border border-indigo-500/30 rounded-2xl p-5 mb-6 shadow-inner">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Current Runway</span>
              <div className="text-xl font-bold text-slate-300">
                {survivalAnalysis.monthsRemaining}m {survivalAnalysis.daysRemaining}d
              </div>
              <p className="text-[10px] text-slate-500">Burn: {formatCurrency(currentBurn)}/mo</p>
            </div>

            <div className="space-y-1 border-l border-slate-700/80">
              <span className="text-[11px] text-amber-400 uppercase font-bold flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" />
                Simulated New Runway
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-400">
                {simulatedMonths}m {simulatedDaysRemainder}d
              </div>
              <p className="text-[10px] text-emerald-300 font-medium">
                +{gainedMonths}m {gainedDaysRemainder}d bonus runway!
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-center text-xs text-slate-300">
            New Estimated Exhaustion Date: <strong className="text-amber-400">{calcTargetDate(simulatedDays)}</strong>
          </div>
        </div>

        {/* Simulator Controls */}
        <div className="space-y-5">
          {/* Slider: Monthly Expense Cut */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <label className="font-semibold text-slate-300">
                Monthly Spending Reduction:
              </label>
              <span className="text-sm font-bold text-indigo-400">
                -{formatCurrency(monthlyExpenseCut)}/mo
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={Math.min(50000, currentBurn - 2000)}
              step={1000}
              value={monthlyExpenseCut}
              onChange={(e) => setMonthlyExpenseCut(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-2"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>₹0 (No cuts)</span>
              <span>-₹{Math.min(50000, currentBurn - 2000).toLocaleString('en-IN')} (Aggressive savings)</span>
            </div>
          </div>

          {/* Toggle: Recover Lent Money */}
          {survivalAnalysis.totalReceivables > 0 && (
            <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-white block">Include Money Lent Recovery</span>
                <span className="text-[11px] text-amber-300">
                  + {formatCurrency(survivalAnalysis.totalReceivables)} (From friends/relatives)
                </span>
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
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200/90 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-amber-300">
              <Lightbulb className="w-4 h-4" />
              <span>Survival Runway Tip:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">
              Cutting non-essential subscriptions, negotiating a temporary rent reduction with your landlord, and avoiding dining out can easily buy you 2 to 3 months of extra time to land the right job offer.
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-indigo-600/30"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
};
