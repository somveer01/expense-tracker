import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  KeyRound, 
  AlertCircle, 
  CheckCircle, 
  Flame, 
  ShieldCheck,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, signup, resetPassword } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'config'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Firebase Config State
  const [customApiKey, setCustomApiKey] = useState('');
  const [customProjectId, setCustomProjectId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          onClose();
        } else {
          setError(res.error || 'Login failed. Please check your credentials.');
        }
      } else if (mode === 'signup') {
        const res = await signup(email, password, name);
        if (res.success) {
          onClose();
        } else {
          setError(res.error || 'Signup failed.');
        }
      } else if (mode === 'forgot') {
        const res = await resetPassword(email);
        if (res.success) {
          setSuccessMsg(res.message || 'Password reset link sent to your email.');
        } else {
          setError(res.error || 'Failed to send password reset email.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    await login('demo.survivor@gmail.com', 'password123');
    setLoading(false);
    onClose();
  };

  const handleSaveFirebaseConfig = () => {
    if (!customApiKey || !customProjectId) {
      setError('Please provide both API Key and Project ID');
      return;
    }
    const config = {
      apiKey: customApiKey,
      authDomain: `${customProjectId}.firebaseapp.com`,
      projectId: customProjectId,
      storageBucket: `${customProjectId}.appspot.com`,
      messagingSenderId: '1234567890',
      appId: '1:1234567890:web:abcdef123456'
    };
    localStorage.setItem('surviva_firebase_config', JSON.stringify(config));
    setSuccessMsg('Firebase configuration saved! Reloading page...');
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-3">
            {mode === 'forgot' ? (
              <KeyRound className="w-6 h-6" />
            ) : mode === 'config' ? (
              <Settings className="w-6 h-6" />
            ) : (
              <ShieldCheck className="w-6 h-6" />
            )}
          </div>
          <h2 className="text-xl font-bold text-white">
            {mode === 'login' && 'Sign In'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'forgot' && 'Reset Password'}
            {mode === 'config' && 'Firebase Configuration'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'forgot'
              ? 'Enter your email to receive password reset instructions'
              : mode === 'config'
              ? 'Connect your personal Firebase Project'
              : 'Your survival financial data stays private and secure'}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-300 text-xs">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {mode === 'config' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Firebase API Key</label>
              <input
                type="text"
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Firebase Project ID</label>
              <input
                type="text"
                value={customProjectId}
                onChange={(e) => setCustomProjectId(e.target.value)}
                placeholder="my-layoff-tracker"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <button
              onClick={handleSaveFirebaseConfig}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition"
            >
              Save Credentials
            </button>
            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Sharma"
                    className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-slate-300">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs text-indigo-400 hover:text-indigo-300"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-lg text-sm shadow-lg shadow-indigo-600/30 transition duration-150"
            >
              {loading ? 'Please wait...' : (
                mode === 'login' ? 'Sign In' :
                mode === 'signup' ? 'Create Account' :
                'Send Password Reset Link'
              )}
            </button>
          </form>
        )}

        {/* Quick Demo Access */}
        {mode !== 'config' && (
          <div className="mt-5 pt-4 border-t border-slate-800 space-y-3">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2 bg-slate-800/80 hover:bg-slate-750 border border-slate-750 text-slate-300 hover:text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>One-Click Demo Sign In (Explore instantly)</span>
            </button>

            <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
              {mode === 'login' ? (
                <>
                  <span>Need an account?</span>
                  <button onClick={() => setMode('signup')} className="text-indigo-400 hover:underline font-medium">
                    Sign Up
                  </button>
                </>
              ) : mode === 'signup' ? (
                <>
                  <span>Already have an account?</span>
                  <button onClick={() => setMode('login')} className="text-indigo-400 hover:underline font-medium">
                    Sign In
                  </button>
                </>
              ) : (
                <button onClick={() => setMode('login')} className="text-indigo-400 hover:underline font-medium mx-auto">
                  ← Back to Sign In
                </button>
              )}
            </div>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setMode('config')}
                className="text-[11px] text-slate-500 hover:text-slate-400 flex items-center justify-center gap-1 mx-auto"
              >
                <Settings className="w-3 h-3" />
                <span>Configure Firebase Credentials</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
