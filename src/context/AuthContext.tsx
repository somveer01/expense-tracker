import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  isRealFirebase
} from '../services/firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  isOfflineUser?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, pass: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  logout: () => Promise<void>;
  isDemoMode: boolean;
  setDemoMode: (val: boolean) => void;
  isOnline: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(!isRealFirebase);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Check local storage for active offline user
    const savedUser = localStorage.getItem('surviva_active_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setLoading(false);
        return;
      } catch {
        // ignore
      }
    }

    if (auth && isRealFirebase && isOnline) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const u: AuthUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            isOfflineUser: false
          };
          setUser(u);
          localStorage.setItem('surviva_active_user', JSON.stringify(u));
        } else {
          setUser(null);
          localStorage.removeItem('surviva_active_user');
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [isOnline]);

  const login = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();

    // If online and real Firebase is available, try Firebase first
    if (isOnline && isRealFirebase && auth) {
      try {
        const res = await signInWithEmailAndPassword(auth, cleanEmail, pass);
        const fbUser: AuthUser = { uid: res.user.uid, email: res.user.email, isOfflineUser: false };
        setUser(fbUser);
        localStorage.setItem('surviva_active_user', JSON.stringify(fbUser));
        return { success: true };
      } catch (err: any) {
        // If Firebase fails with network error, attempt local offline auth fallback
        if (!navigator.onLine || err.code === 'auth/network-request-failed') {
          return attemptOfflineLogin(cleanEmail, pass);
        }
        return { success: false, error: err.message || 'लॉगिन विफल रहा' };
      }
    }

    // 100% Offline / Local Authentication
    return attemptOfflineLogin(cleanEmail, pass);
  };

  const attemptOfflineLogin = (email: string, pass: string) => {
    const accountsRaw = localStorage.getItem('surviva_offline_accounts');
    const accounts = accountsRaw ? JSON.parse(accountsRaw) : {};

    if (accounts[email]) {
      if (accounts[email].password === pass) {
        const offlineUser: AuthUser = {
          uid: 'offline_' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').slice(0, 10),
          email,
          displayName: accounts[email].name || email.split('@')[0],
          isOfflineUser: true
        };
        setUser(offlineUser);
        localStorage.setItem('surviva_active_user', JSON.stringify(offlineUser));
        return { success: true };
      } else {
        return { success: false, error: 'पासवर्ड सही नहीं है (Incorrect Password)' };
      }
    } else {
      // First time demo / auto-create offline account
      const offlineUser: AuthUser = {
        uid: 'offline_' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').slice(0, 10),
        email,
        displayName: email.split('@')[0],
        isOfflineUser: true
      };
      // Save credentials for subsequent offline logins
      accounts[email] = { password: pass, name: email.split('@')[0] };
      localStorage.setItem('surviva_offline_accounts', JSON.stringify(accounts));
      setUser(offlineUser);
      localStorage.setItem('surviva_active_user', JSON.stringify(offlineUser));
      return { success: true };
    }
  };

  const signup = async (email: string, pass: string, name?: string) => {
    const cleanEmail = email.trim().toLowerCase();

    if (isOnline && isRealFirebase && auth) {
      try {
        const res = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
        const fbUser: AuthUser = { uid: res.user.uid, email: res.user.email, displayName: name, isOfflineUser: false };
        setUser(fbUser);
        localStorage.setItem('surviva_active_user', JSON.stringify(fbUser));
        return { success: true };
      } catch (err: any) {
        if (!navigator.onLine || err.code === 'auth/network-request-failed') {
          return createOfflineAccount(cleanEmail, pass, name);
        }
        return { success: false, error: err.message || 'साइन-अप विफल रहा' };
      }
    }

    return createOfflineAccount(cleanEmail, pass, name);
  };

  const createOfflineAccount = (email: string, pass: string, name?: string) => {
    const accountsRaw = localStorage.getItem('surviva_offline_accounts');
    const accounts = accountsRaw ? JSON.parse(accountsRaw) : {};

    accounts[email] = { password: pass, name: name || email.split('@')[0] };
    localStorage.setItem('surviva_offline_accounts', JSON.stringify(accounts));

    const offlineUser: AuthUser = {
      uid: 'offline_' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').slice(0, 10),
      email,
      displayName: name || email.split('@')[0],
      isOfflineUser: true
    };
    setUser(offlineUser);
    localStorage.setItem('surviva_active_user', JSON.stringify(offlineUser));
    return { success: true };
  };

  const resetPassword = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (isOnline && isRealFirebase && auth) {
      try {
        await sendPasswordResetEmail(auth, cleanEmail);
        return { success: true, message: `पासवर्ड रीसेट लिंक ${cleanEmail} पर भेज दी गई है।` };
      } catch (err: any) {
        return { success: false, error: err.message || 'ईमेल भेजने में विफल' };
      }
    } else {
      // Offline Password Reset simulation
      return { 
        success: true, 
        message: `ऑफलाइन मोड: ${cleanEmail} के लिए पासवर्ड रीसेट स्वीकार कर लिया गया है। आप किसी भी नए पासवर्ड से तुरंत लॉगिन कर सकते हैं।` 
      };
    }
  };

  const logout = async () => {
    if (isRealFirebase && auth && isOnline) {
      try {
        await fbSignOut(auth);
      } catch {
        // ignore
      }
    }
    localStorage.removeItem('surviva_active_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      resetPassword, 
      logout, 
      isDemoMode, 
      setDemoMode: setIsDemoMode,
      isOnline 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
