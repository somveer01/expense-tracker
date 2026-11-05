import React, { useState, useRef, useEffect } from 'react';
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
  Trash2,
  MoreVertical,
  CheckCircle2,
  ChevronDown
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
  const [isDataMenuOpen, setIsDataMenuOpen] = useState(false);
  const dataMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dataMenuRef.current && !dataMenuRef.current.contains(e.target as Node)) {
        setIsDataMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const navItems = [
    { id: 'dashboard', label: 'Overview', badge: `${survivalAnalysis.monthsRemaining}m` },
    { id: 'accounts', label: 'Accounts', count: survivalAnalysis.totalCapital > 0 ? `₹${Math.round(survivalAnalysis.totalCapital / 1000)}k` : undefined },
    { id: 'budget', label: 'Budget', count: survivalAnalysis.monthlyBurnRate > 0 ? `₹${Math.round(survivalAnalysis.monthlyBurnRate / 1000)}k` : undefined },
    { id: 'expenses', label: 'Daily Expenses' },
    { id: 'lent', label: 'Money Lent', count: survivalAnalysis.totalReceivables > 0 ? `₹${Math.round(survivalAnalysis.totalReceivables / 1000)}k` : undefined },
    { id: 'debts', label: 'Debts & Loans', count: survivalAnalysis.totalPayables > 0 ? `₹${Math.round(survivalAnalysis.totalPayables / 1000)}k` : undefined },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors w-full max-w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        {/* Row 1: Brand & Key Utility Controls */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3 w-full">
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0 select-none group" 
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition shrink-0">
              <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                  SurvivaTrack
                </span>
                <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40">
                  Runway Shield
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block">
                Layoff Runway & Emergency Finance
              </p>
            </div>
          </div>

          {/* Quick Metrics Capsule (Desktop) */}
          <div className="hidden xl:flex items-center gap-3.5 bg-slate-50 dark:bg-slate-800/70 px-4 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700/60 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <Wallet className="w-3.5 h-3.5 text-emerald-500" />
              <span>Capital:</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(survivalAnalysis.totalCapital)}</strong>
            </div>

            <div className="h-3 w-px bg-slate-200 dark:bg-slate-700" />

            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
              <span>Burn:</span>
              <strong className="text-rose-600 dark:text-rose-400 font-bold">{formatCurrency(survivalAnalysis.monthlyBurnRate)}/mo</strong>
            </div>

            <div className="h-3 w-px bg-slate-200 dark:bg-slate-700" />

            <div className="flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-700 dark:text-amber-300">
                {survivalAnalysis.monthsRemaining}m {survivalAnalysis.daysRemaining}d Runway
              </span>
            </div>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Month Dropdown */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-2 py-1 text-xs">
              <Calendar className="w-3.5 h-3.5 text-indigo-500 mr-1.5 hidden xs:inline" />
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-slate-800 dark:text-slate-200 outline-none cursor-pointer font-semibold text-xs"
              >
                {getMonthOptions().map(opt => (
                  <option key={opt.val} value={opt.val} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* What-If Simulator Pill */}
            <button
              onClick={onOpenSimulator}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] text-white text-xs font-semibold shadow-sm transition"
              title="Open Layoff Simulator"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Simulator</span>
            </button>

            {/* Light/Dark Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/80 dark:border-slate-700/80 transition"
              title={`Switch to ${theme === 'dark' ? 'Light Theme' : 'Dark Theme'}`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Font / Display Settings */}
            <button
              onClick={onOpenThemeModal}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/80 dark:border-slate-700/80 transition hidden sm:inline-flex"
              title="Display & Font Settings"
            >
              <Type className="w-4 h-4" />
            </button>

            {/* Data / Settings Dropdown */}
            <div className="relative" ref={dataMenuRef}>
              <button
                onClick={() => setIsDataMenuOpen(!isDataMenuOpen)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-700/80 transition flex items-center gap-1"
                title="Data Options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {isDataMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    onClick={() => {
                      setIsDataMenuOpen(false);
                      onOpenOfflineModal();
                    }}
                    className="w-full px-4 py-2.5 flex items-center gap-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-left font-medium transition"
                  >
                    <HardDriveDownload className="w-4 h-4 text-indigo-500" />
                    <span>Backup & Restore Data</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDataMenuOpen(false);
                      onOpenThemeModal();
                    }}
                    className="w-full px-4 py-2.5 flex items-center gap-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-left font-medium transition sm:hidden"
                  >
                    <Type className="w-4 h-4 text-indigo-500" />
                    <span>Display & Font Settings</span>
                  </button>

                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                  <button
                    onClick={() => {
                      setIsDataMenuOpen(false);
                      resetToSampleData();
                    }}
                    className="w-full px-4 py-2.5 flex items-center gap-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-left font-medium transition"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-400" />
                    <span>Load Demo Sample Data</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDataMenuOpen(false);
                      setIsConfirmClearOpen(true);
                    }}
                    className="w-full px-4 py-2.5 flex items-center gap-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left font-semibold transition"
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                    <span>Clear All Data</span>
                  </button>
                </div>
              )}
            </div>

            {/* Auth / Profile */}
            {user ? (
              <button
                onClick={logout}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
              >
                <User className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Clean Segmented Navigation Tabs */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 -mx-3 sm:-mx-6 lg:-mx-8 px-3 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-1.5 py-2 text-xs font-medium">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 select-none ${
                    isActive
                      ? 'bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.count && !isActive && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Confirmation Modal for Clear Data */}
      {isConfirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Clear All Data?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Start fresh with empty records</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This will remove all demo bank accounts, debts, daily expenses, and receivables from your device. You can then enter your own real numbers.
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