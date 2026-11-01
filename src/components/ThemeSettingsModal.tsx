import React from 'react';
import { 
  Sun, 
  Moon, 
  Type, 
  Check, 
  X, 
  Smartphone,
  Eye,
  Sliders
} from 'lucide-react';
import { useTheme, FontFamily, FontSize } from '../context/ThemeContext';

interface ThemeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSettingsModal: React.FC<ThemeSettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme, fontSize, setFontSize, fontFamily, setFontFamily } = useTheme();

  if (!isOpen) return null;

  const fontOptions: { id: FontFamily; label: string; sample: string; desc: string }[] = [
    { id: 'lexend', label: 'Lexend (Recommended)', sample: '123,456 • Clean Numbers', desc: 'Google font built for maximum reading clarity' },
    { id: 'jakarta', label: 'Plus Jakarta Sans', sample: 'Modern Fintech UI', desc: 'Crisp, contemporary aesthetic' },
    { id: 'inter', label: 'Inter', sample: 'Highly Legible', desc: 'Standard mobile app typography' },
    { id: 'poppins', label: 'Poppins', sample: 'Friendly & Rounded', desc: 'Geometric, soft edges' },
    { id: 'system', label: 'System Native', sample: 'Roboto / SF Pro', desc: 'Native Android & iOS look' }
  ];

  const sizeOptions: { id: FontSize; label: string; scale: string }[] = [
    { id: 'normal', label: 'Standard', scale: '100%' },
    { id: 'large', label: 'Large (Clearer)', scale: '115%' },
    { id: 'xlarge', label: 'Extra Large (Maximum Visibility)', scale: '130%' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-900 dark:text-slate-100 transition-colors">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-md">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Display & Theme Settings</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize light/dark theme, font styles, and text size for Android visibility.
            </p>
          </div>
        </div>

        {/* 1. Theme Toggle (Light vs Dark) */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Color Theme
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition ${
                theme === 'light'
                  ? 'bg-indigo-50 dark:bg-slate-800 border-indigo-600 text-indigo-900 dark:text-indigo-300 font-bold shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sun className={`w-5 h-5 ${theme === 'light' ? 'text-amber-500' : 'text-slate-400'}`} />
                <div>
                  <span className="block text-sm">Light Theme</span>
                  <span className="text-[10px] text-slate-500 font-normal">Clean bright daylight mode</span>
                </div>
              </div>
              {theme === 'light' && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition ${
                theme === 'dark'
                  ? 'bg-indigo-950/40 border-indigo-500 text-indigo-300 font-bold shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-slate-400'}`} />
                <div>
                  <span className="block text-sm">Dark Theme</span>
                  <span className="text-[10px] text-slate-500 font-normal">OLED high-contrast dark</span>
                </div>
              </div>
              {theme === 'dark' && <Check className="w-4 h-4 text-indigo-400" />}
            </button>
          </div>
        </div>

        {/* 2. Font Size Scaling */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Text & Number Size (Readability)
            </label>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
              {fontSize === 'normal' ? 'Normal' : fontSize === 'large' ? 'Large (+15%)' : 'Extra Large (+30%)'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {sizeOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => setFontSize(opt.id)}
                className={`py-2.5 px-3 rounded-xl border text-center transition ${
                  fontSize === opt.id
                    ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span className="block text-xs font-bold">{opt.label}</span>
                <span className="text-[10px] opacity-80">{opt.scale}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Font Family Selection */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-indigo-500" />
            <span>Font Family (Clarity & Style)</span>
          </label>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {fontOptions.map(f => (
              <button
                key={f.id}
                onClick={() => setFontFamily(f.id)}
                className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                  fontFamily === f.id
                    ? 'bg-indigo-50 dark:bg-slate-800 border-indigo-600 dark:border-indigo-500 text-indigo-900 dark:text-indigo-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{f.label}</span>
                    <span className="text-[11px] text-slate-400 font-normal">({f.sample})</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{f.desc}</span>
                </div>
                {fontFamily === f.id && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Live Preview:</span>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Emergency Runway:</span>
            <span className="font-extrabold text-amber-500 text-base">5 months 14 days</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Liquid Capital: <strong>₹2,28,000</strong> • Monthly Burn: <strong>₹34,399</strong>
          </p>
        </div>

        {/* Confirm Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-indigo-600/30"
        >
          Apply & Return to App
        </button>
      </div>
    </div>
  );
};
