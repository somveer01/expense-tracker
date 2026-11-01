import React, { useState, useRef } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Download, 
  Upload, 
  HardDrive, 
  Check, 
  AlertCircle, 
  X,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

interface OfflineBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredInstallPrompt?: any;
}

export const OfflineBackupModal: React.FC<OfflineBackupModalProps> = ({ 
  isOpen, 
  onClose,
  deferredInstallPrompt 
}) => {
  const { isOnline } = useAuth();
  const { exportBackupJSON, importBackupJSON, accounts, moneyLent, debts, dailyExpenses } = useApp();

  const [importStatus, setImportStatus] = useState<{ success: boolean; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importBackupJSON(content);
      if (success) {
        setImportStatus({ success: true, msg: 'Backup restored successfully!' });
        setTimeout(() => {
          setImportStatus(null);
          onClose();
        }, 1500);
      } else {
        setImportStatus({ success: false, msg: 'Invalid backup file format. Please choose a valid JSON file.' });
      }
    };
    reader.readAsText(file);
  };

  const handleInstallApp = async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const choiceResult = await deferredInstallPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User installed the PWA');
      }
    } else {
      alert('Open your browser menu (⋮ or Share) and select "Add to Home Screen" or "Install App".');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
            isOnline ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
          }`}>
            {isOnline ? <Wifi className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">100% Offline Mode & Backup</h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isOnline ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
              }`}>
                {isOnline ? '● Online' : '● Offline Mode Active'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This app is 100% offline-ready. All your financial data stays securely on your device.
            </p>
          </div>
        </div>

        {/* Storage stats */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
            <HardDrive className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            <span>Securely Stored in Device Storage:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 rounded-lg">
              <span className="block text-[10px] text-slate-500">Accounts</span>
              <strong className="text-slate-900 dark:text-white">{accounts.length}</strong>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 rounded-lg">
              <span className="block text-[10px] text-slate-500">Money Lent</span>
              <strong className="text-slate-900 dark:text-white">{moneyLent.length}</strong>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 rounded-lg">
              <span className="block text-[10px] text-slate-500">Debts/Loans</span>
              <strong className="text-slate-900 dark:text-white">{debts.length}</strong>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 rounded-lg">
              <span className="block text-[10px] text-slate-500">Expenses</span>
              <strong className="text-slate-900 dark:text-white">{dailyExpenses.length}</strong>
            </div>
          </div>
        </div>

        {/* Import status alert */}
        {importStatus && (
          <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
            importStatus.success ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30'
          }`}>
            {importStatus.success ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{importStatus.msg}</span>
          </div>
        )}

        {/* Action Buttons: Export & Import */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Data Backup & Migration
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Export JSON */}
            <button
              onClick={exportBackupJSON}
              className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition flex items-center gap-3 group"
            >
              <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-xs font-semibold text-slate-900 dark:text-white">Download Backup</strong>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Save JSON file to your device</span>
              </div>
            </button>

            {/* Import JSON */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition flex items-center gap-3 group"
            >
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-xs font-semibold text-slate-900 dark:text-white">Restore Backup</strong>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Upload existing JSON file</span>
              </div>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>

        {/* Install as Native App (PWA) */}
        <div className="p-4 bg-indigo-50/80 dark:bg-gradient-to-r dark:from-indigo-950/40 dark:to-slate-800 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div className="text-xs">
              <strong className="text-slate-900 dark:text-white block">Install on Device (Android / iOS / PC)</strong>
              <span className="text-slate-600 dark:text-slate-400 text-[11px]">Run fullscreen as a native app</span>
            </div>
          </div>
          <button
            onClick={handleInstallApp}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition shadow-md shadow-indigo-600/30 whitespace-nowrap"
          >
            Install App
          </button>
        </div>
      </div>
    </div>
  );
};
