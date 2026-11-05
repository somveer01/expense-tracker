import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { AccountsManager } from './components/AccountsManager';
import { MonthlyBudgetManager } from './components/MonthlyBudgetManager';
import { DailyExpensesManager } from './components/DailyExpensesManager';
import { MoneyLentManager } from './components/MoneyLentManager';
import { DebtsManager } from './components/DebtsManager';
import { MiniRunwayBanner } from './components/MiniRunwayBanner';
import { AuthModal } from './components/AuthModal';
import { SurvivalSimulatorModal } from './components/SurvivalSimulatorModal';
import { OfflineBackupModal } from './components/OfflineBackupModal';
import { ThemeSettingsModal } from './components/ThemeSettingsModal';
import { 
  ShieldCheck, 
  WifiOff, 
  HardDrive,
  LayoutDashboard,
  Wallet,
  CalendarDays,
  ShoppingBag,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  HandCoins,
  CreditCard,
  Sparkles,
  Sliders,
  Plus
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useApp } from './context/AppContext';

export const App: React.FC = () => {
  const { isOnline } = useAuth();
  const { toast, survivalAnalysis } = useApp();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);

  // Capture PWA install prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const formatCurrency = (amt: number) => '₹' + amt.toLocaleString('en-IN');

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Offline Status Banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-slate-950 text-xs py-2 px-3 sm:px-4 font-bold flex items-center justify-between shadow-lg sticky top-0 z-50 w-full max-w-full">
          <div className="flex items-center gap-2 mx-auto sm:mx-0 min-w-0">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span className="truncate">
              ⚡ Offline Mode: Changes are saved safely to your device!
            </span>
          </div>
          <button
            onClick={() => setIsOfflineModalOpen(true)}
            className="hidden sm:flex items-center gap-1 bg-slate-950 text-amber-300 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold hover:bg-slate-900 transition shrink-0"
          >
            <HardDrive className="w-3 h-3" />
            <span>Backup Data</span>
          </button>
        </div>
      )}

      {/* Top Header & Navigation */}
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenOfflineModal={() => setIsOfflineModalOpen(true)}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 sm:pb-12 min-w-0">
        {/* Compact Runway Banner on Sub-Tabs */}
        {activeTab !== 'dashboard' && (
          <MiniRunwayBanner 
            setActiveTab={setActiveTab}
            onOpenSimulator={() => setIsSimulatorOpen(true)}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            setActiveTab={setActiveTab}
            onOpenSimulator={() => setIsSimulatorOpen(true)}
            onOpenAddExpense={() => {
              setActiveTab('expenses');
              setIsAddExpenseOpen(true);
            }}
            onOpenAddAccount={() => {
              setActiveTab('accounts');
              setIsAddAccountOpen(true);
            }}
          />
        )}

        {activeTab === 'accounts' && (
          <AccountsManager 
            isAddModalOpen={isAddAccountOpen}
            setIsAddModalOpen={setIsAddAccountOpen}
          />
        )}

        {activeTab === 'budget' && (
          <MonthlyBudgetManager />
        )}

        {activeTab === 'expenses' && (
          <DailyExpensesManager
            isAddModalOpen={isAddExpenseOpen}
            setIsAddModalOpen={setIsAddExpenseOpen}
          />
        )}

        {activeTab === 'lent' && (
          <MoneyLentManager />
        )}

        {activeTab === 'debts' && (
          <DebtsManager />
        )}
      </main>

      {/* Native Mobile Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200/80 dark:border-slate-800 backdrop-blur-lg px-2 py-1.5 flex items-center justify-around shadow-2xl transition-colors">
        {/* 1. Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition ${
            activeTab === 'dashboard' 
              ? 'text-indigo-600 dark:text-indigo-400 font-bold' 
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <div className="relative">
            <LayoutDashboard className="w-5 h-5" />
            {survivalAnalysis.totalCapital > 0 && (
              <span className="absolute -top-1 -right-3 text-[8px] font-black bg-indigo-600 text-white px-1 rounded-full leading-tight">
                {survivalAnalysis.monthsRemaining}m
              </span>
            )}
          </div>
          <span className="text-[10px]">Overview</span>
        </button>

        {/* 2. Capital / Accounts */}
        <button
          onClick={() => setActiveTab('accounts')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition ${
            activeTab === 'accounts' 
              ? 'text-indigo-600 dark:text-indigo-400 font-bold' 
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px]">Accounts</span>
        </button>

        {/* 3. Central Quick Add Floating Pill Button */}
        <button
          onClick={() => {
            setActiveTab('expenses');
            setIsAddExpenseOpen(true);
          }}
          className="flex flex-col items-center -mt-5"
          title="Add Daily Expense"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 active:scale-95 transition">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">Add</span>
        </button>

        {/* 4. Budget */}
        <button
          onClick={() => setActiveTab('budget')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition ${
            activeTab === 'budget' 
              ? 'text-indigo-600 dark:text-indigo-400 font-bold' 
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <CalendarDays className="w-5 h-5" />
          <span className="text-[10px]">Budget</span>
        </button>

        {/* 5. More Menu */}
        <button
          onClick={() => setIsMobileMoreOpen(true)}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition ${
            (activeTab === 'lent' || activeTab === 'debts') 
              ? 'text-indigo-600 dark:text-indigo-400 font-bold' 
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px]">More</span>
        </button>
      </nav>

      {/* Mobile "More" Drawer Modal */}
      {isMobileMoreOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm sm:hidden animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-900 dark:text-white">More Features & Tools</span>
              <button 
                onClick={() => setIsMobileMoreOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Money Lent */}
              <button
                onClick={() => {
                  setActiveTab('lent');
                  setIsMobileMoreOpen(false);
                }}
                className={`p-3.5 rounded-2xl border flex items-center justify-between text-left transition ${
                  activeTab === 'lent'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/60 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <HandCoins className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Money Lent (Receivables)</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Track money lent to friends</span>
                  </div>
                </div>
                <strong className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                  {formatCurrency(survivalAnalysis.totalReceivables)}
                </strong>
              </button>

              {/* Debts & Loans */}
              <button
                onClick={() => {
                  setActiveTab('debts');
                  setIsMobileMoreOpen(false);
                }}
                className={`p-3.5 rounded-2xl border flex items-center justify-between text-left transition ${
                  activeTab === 'debts'
                    ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800/60 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Debts & EMIs (Payables)</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Personal loans & credit cards</span>
                  </div>
                </div>
                <strong className="text-xs text-purple-600 dark:text-purple-400 font-bold">
                  {formatCurrency(survivalAnalysis.totalPayables)}
                </strong>
              </button>

              {/* What-If Simulator */}
              <button
                onClick={() => {
                  setIsMobileMoreOpen(false);
                  setIsSimulatorOpen(true);
                }}
                className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Layoff Survival Simulator</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">What-if analysis: extend runway by cutting costs</span>
                </div>
              </button>

              {/* Offline Backup */}
              <button
                onClick={() => {
                  setIsMobileMoreOpen(false);
                  setIsOfflineModalOpen(true);
                }}
                className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Backup & Restore</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Download or upload JSON data</span>
                </div>
              </button>

              {/* Theme Settings */}
              <button
                onClick={() => {
                  setIsMobileMoreOpen(false);
                  setIsThemeModalOpen(true);
                }}
                className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Theme & Font Settings</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Customize text size & typography</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-900 bg-white dark:bg-slate-950/80 py-6 text-center text-xs text-slate-500 hidden sm:block transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <span>SurvivaTrack • Modern Layoff Survival Runway App</span>
          </div>
          <div className="text-slate-500 text-[11px] flex items-center gap-3">
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="hover:text-slate-800 dark:hover:text-slate-300 underline"
            >
              Theme & Font Settings
            </button>
            <span>•</span>
            <button
              onClick={() => setIsOfflineModalOpen(true)}
              className="hover:text-slate-800 dark:hover:text-slate-300 underline"
            >
              Offline Backup
            </button>
            <span>•</span>
            <span>100% Offline & Private</span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <SurvivalSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />

      <OfflineBackupModal
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
        deferredInstallPrompt={deferredPrompt}
      />

      <ThemeSettingsModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200 pointer-events-none">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs sm:text-sm font-semibold backdrop-blur-md pointer-events-auto ${
            toast.type === 'error'
              ? 'bg-rose-900/90 text-white border-rose-700/80 shadow-rose-900/20'
              : toast.type === 'info'
              ? 'bg-slate-900/90 text-white border-slate-700/80 shadow-slate-900/20'
              : 'bg-emerald-900/90 text-white border-emerald-700/80 shadow-emerald-900/20'
          }`}>
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 text-cyan-300 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            )}
            <span>{toast.msg}</span>
          </div>
        </div>
      )}
    </div>
  );
};