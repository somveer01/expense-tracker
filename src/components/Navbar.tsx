import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldAlert, 
  Calendar, 
  LogOut, 
  User, 
  RotateCcw,
  Sparkles,
  HardDriveDownload,
  Sun,
  Moon,
  Type,
  Trash2,
  MoreVertical,
  CheckCircle2
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
  const { user, logout } = useAuth();
  const { selectedMonth, setSelectedMonth, resetToSampleData, clearAllData } = useApp();
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

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors w-full">
      <div className="px-3.5 py-2.5 flex items-center justify-between gap-2 w-full">
        {/* Brand & App Title */}
        <div 
          className="flex items-center gap-2 cursor-pointer select-none active:scale-95 transition shrink-0" 
          onClick={() => setActiveTab('dashboard')}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight leading-none">
              SurvivaTrack
            </h1>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold block leading-tight">
              Android App
            </span>
          </div>
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Month Dropdown Pill */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-2 py-1 text-xs">
            <Calendar className="w-3 h-3 text-indigo-500 mr-1" />
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 outline-none cursor-pointer font-bold text-[11px]"
            >
              {getMonthOptions().map(opt => (
                <option key={opt.val} value={opt.val} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Light/Dark Theme Switch */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/80 dark:border-slate-700/80 transition"
            title={`Switch to ${theme === 'dark' ? 'Light Theme' : 'Dark Theme'}`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* What-If Simulator Pill */}
          <button
            onClick={onOpenSimulator}
            className="p-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 active:scale-95 text-white transition shadow-sm"
            title="Open Simulator"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Android Options Menu (⋮) */}
          <div className="relative" ref={dataMenuRef}>
            <button
              onClick={() => setIsDataMenuOpen(!isDataMenuOpen)}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-700/80 transition"
              title="Android App Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isDataMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
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
                  className="w-full px-4 py-2.5 flex items-center gap-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-left font-medium transition"
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

                {user ? (
                  <>
                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                    <button
                      onClick={() => {
                        setIsDataMenuOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                    <button
                      onClick={() => {
                        setIsDataMenuOpen(false);
                        onOpenAuth();
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-left font-bold transition"
                    >
                      <User className="w-4 h-4" />
                      <span>Sign In</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Clear Data */}
      {isConfirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Clear All Data?</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Start fresh with empty records</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This will remove all demo bank accounts, debts, daily expenses, and receivables from your device.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmClearOpen(false)}
                className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAllData();
                  setIsConfirmClearOpen(false);
                }}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition shadow-sm"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};