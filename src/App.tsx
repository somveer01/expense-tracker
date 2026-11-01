import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { AccountsManager } from './components/AccountsManager';
import { MonthlyBudgetManager } from './components/MonthlyBudgetManager';
import { DailyExpensesManager } from './components/DailyExpensesManager';
import { MoneyLentManager } from './components/MoneyLentManager';
import { DebtsManager } from './components/DebtsManager';
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
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from './context/AuthContext';

export const App: React.FC = () => {
  const { isOnline } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);

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

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Offline Status Top Banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-slate-950 text-xs py-2 px-3 sm:px-4 font-bold flex items-center justify-between shadow-lg sticky top-0 z-50 w-full max-w-full">
          <div className="flex items-center gap-2 mx-auto sm:mx-0 min-w-0">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span className="truncate">
              ⚡ Offline Mode Active: Saved to local storage!
            </span>
          </div>
          <button
            onClick={() => setIsOfflineModalOpen(true)}
            className="hidden sm:flex items-center gap-1 bg-slate-950 text-amber-300 px-2 py-0.5 rounded text-[11px] font-semibold hover:bg-slate-900 transition shrink-0"
          >
            <HardDrive className="w-3 h-3" />
            <span>Backup Data</span>
          </button>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenOfflineModal={() => setIsOfflineModalOpen(true)}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 sm:pb-12 min-w-0">
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

      {/* Android Mobile Native Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-lg px-2 py-1.5 flex items-center justify-around shadow-2xl transition-colors">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition ${
            activeTab === 'dashboard' 
              ? 'text-indigo-600 dark:text-indigo-400 font-bold' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Runway</span>
        </button>

        <button
          onClick={() => setActiveTab('accounts')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition ${
            activeTab === 'accounts' 
              ? 'text-indigo-600 dark:text-indigo-400 font-bold' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px]">Capital</span>
        </button>

        <button
          onClick={() => setActiveTab('budget')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition ${
            activeTab === 'budget' 
              ? 'text-indigo-600 dark:text-indigo-400 font-bold' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <CalendarDays className="w-5 h-5" />
          <span className="text-[10px]">Budget</span>
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition ${
            activeTab === 'expenses' 
              ? 'text-indigo-600 dark:text-indigo-400 font-bold' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px]">Daily</span>
        </button>

        <button
          onClick={() => {
            if (activeTab === 'lent') setActiveTab('debts');
            else if (activeTab === 'debts') setActiveTab('lent');
            else setActiveTab('lent');
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition ${
            (activeTab === 'lent' || activeTab === 'debts') 
              ? 'text-indigo-600 dark:text-indigo-400 font-bold' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px]">Lent/Debts</span>
        </button>
      </nav>

      {/* Footer (Desktop) */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950/80 py-6 text-center text-xs text-slate-500 hidden sm:block transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <span>SurvivaTrack • Modern Layoff Runway & Financial Survival App</span>
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
            <span>100% Offline & Mobile Optimized</span>
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
    </div>
  );
};
