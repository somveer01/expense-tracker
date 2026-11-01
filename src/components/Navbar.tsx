import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Wallet, 
  TrendingDown, 
  Calendar, 
  LogOut, 
  User, 
  RotateCcw,
  Sparkles,
  Wifi,
  WifiOff,
  HardDriveDownload,
  Sun,
  Moon,
  Type,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenSimulator: () => void;
  onOpenOfflineModal: () => void;
  onOpenThemeModal: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenAuth, 
  onOpenSimulator, 
  onOpenOfflineModal,
  onOpenThemeModal,
  activeTab, 
  setActiveTab 
}) => {
  const { user, logout, isOnline } = useAuth();
  const { survivalAnalysis, selectedMonth, setSelectedMonth, resetToSampleData, clearAllData } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);

  const getMonthOptions = () => {
    const options = [];
    const base = new Date();
    for (let i = -3; i <= 3; i++) {
      const d = new Date(base.getFullYear(), base.getMonth() + i, 1);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const val = `${year}-${month}`;
      const label = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      options.push({ val, label });
    }
    return options;
  };

  const formatCurrency = (amt: number) => {
    return '₹' + amt.toLocaleString('en-IN');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full max-w-full">
        {/* Line 1: Brand & Top Controls */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 w-full min-w-0">
          {/* Logo & Brand */}
          <div 
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer shrink-0 min-w-0" 
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0">
              <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight truncate">
                  SurvivaTrack
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 uppercase tracking-wider shrink-0">
                  Shield
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block truncate">
                How long will your money last?
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar in Header (Desktop) */}
          <div className="hidden xl:flex items-center gap-4 bg-slate-100 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700/60 shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
              <Wallet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Capital:</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">{formatCurrency(survivalAnalysis.totalCapital)}</strong>
            </div>

            <div className="h-3 w-px bg-slate-300 dark:bg-slate-700" />

            <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
              <TrendingDown className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Burn Rate:</span>
              <strong className="text-rose-600 dark:text-rose-400 font-semibold">{formatCurrency(survivalAnalysis.monthlyBurnRate)}/mo</strong>
            </div>

            <div className="h-3 w-px bg-slate-300 dark:bg-slate-700" />

            <div className="flex items-center gap-1.5 text-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-slate-700 dark:text-slate-300">Runway:</span>
              <span className="bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                {survivalAnalysis.monthsRemaining}m {survivalAnalysis.daysRemaining}d
              </span>
            </div>
          </div>

          {/* Actions & Settings (Mobile-optimized to never overflow) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Month Selector */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl px-1.5 sm:px-2 py-1 text-xs">
              <Calendar className="w-3 h-3 text-indigo-500 mr-1 hidden sm:inline" />
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-slate-800 dark:text-slate-200 outline-none cursor-pointer font-medium text-[11px] sm:text-xs max-w-[80px] xs:max-w-none"
              >
                {getMonthOptions().map(opt => (
                  <option key={opt.val} value={opt.val} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 1-Click Light/Dark Theme Switch */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition shrink-0"
              title={`Switch to ${theme === 'dark' ? 'Light Theme' : 'Dark Theme'}`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Font & Display Settings Trigger */}
            <button
              onClick={onOpenThemeModal}
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition hidden sm:inline-flex shrink-0"
              title="Font & Text Size Settings"
            >
              <Type className="w-4 h-4" />
            </button>

            {/* Offline Status Badge */}
            <button
              onClick={onOpenOfflineModal}
              className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold border transition shrink-0 ${
                isOnline 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  : 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40 animate-pulse'
              }`}
              title="Offline Mode & Data Backup"
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden lg:inline">Offline Ready</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden xs:inline">Offline</span>
                </>
              )}
            </button>

            {/* What-If Simulator */}
            <button
              onClick={onOpenSimulator}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-[11px] sm:text-xs font-semibold shadow-sm transition cursor-pointer shrink-0"
              title="Simulator"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Simulator</span>
            </button>

            {/* Auth / Profile */}
            {user ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                    {user.displayName || user.email}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                    {user.isOfflineUser ? '● Offline' : '● Firebase'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[11px] sm:text-xs font-semibold transition shrink-0"
              >
                <User className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden xs:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Line 2: Navigation Tabs & Runway Overview Bar (Strictly non-overflowing) */}
        <div className="w-full max-w-full overflow-hidden border-t border-slate-200 dark:border-slate-800/80">
          <nav className="w-full max-w-full overflow-x-auto no-scrollbar flex items-center space-x-1 sm:space-x-2 py-2 text-xs font-medium scroll-smooth">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'dashboard' 
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <span>📊 Runway Overview</span>
              <span className="text-[10px] bg-white/20 dark:bg-white/10 px-1.5 py-0.5 rounded font-bold">
                {survivalAnalysis.monthsRemaining}m {survivalAnalysis.daysRemaining}d
              </span>
            </button>

            <button
              onClick={() => setActiveTab('accounts')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition whitespace-nowrap shrink-0 ${
                activeTab === 'accounts' 
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              🏦 Accounts ({survivalAnalysis.totalCapital > 0 ? '₹' + Math.round(survivalAnalysis.totalCapital / 1000) + 'k' : '₹0'})
            </button>

            <button
              onClick={() => setActiveTab('budget')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition whitespace-nowrap shrink-0 ${
                activeTab === 'budget' 
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              📝 Monthly Budget (₹{survivalAnalysis.monthlyBurnRate.toLocaleString('en-IN')})
            </button>

            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition whitespace-nowrap shrink-0 ${
                activeTab === 'expenses' 
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              🛒 Daily Expenses
            </button>

            <button
              onClick={() => setActiveTab('lent')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition whitespace-nowrap shrink-0 ${
                activeTab === 'lent' 
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              🤝 Money Lent (₹{survivalAnalysis.totalReceivables.toLocaleString('en-IN')})
            </button>

            <button
              onClick={() => setActiveTab('debts')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition whitespace-nowrap shrink-0 ${
                activeTab === 'debts' 
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              💳 Debts & Loans (₹{survivalAnalysis.totalPayables.toLocaleString('en-IN')})
            </button>

            <button
              onClick={onOpenOfflineModal}
              title="Data Backup & Restore"
              className="ml-auto text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 text-[11px] whitespace-nowrap font-medium shrink-0"
            >
              <HardDriveDownload className="w-3.5 h-3.5" />
              <span>Backup</span>
            </button>

            <button
              onClick={() => setIsConfirmClearOpen(true)}
              title="Clear all data to start fresh"
              className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1 text-[11px] whitespace-nowrap shrink-0 font-medium transition"
            >
              <Trash2 className="w-3 h-3 text-rose-500" />
              <span>Clear Data</span>
            </button>

            <button
              onClick={resetToSampleData}
              title="Reset to sample demo data"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 text-[11px] whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </nav>
        </div>
      </div>

      {/* In-App Clear Data Confirmation Modal */}
      {isConfirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Clear All Data?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Start fresh with empty records</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This will remove all demo bank accounts, debts, daily expenses, and receivables from your device. You can then enter your own real financial numbers.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmClearOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAllData();
                  setIsConfirmClearOpen(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition shadow-sm"
              >
                Yes, Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
