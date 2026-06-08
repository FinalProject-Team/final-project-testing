import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { apiLogin, apiGoogleLogin, apiGetMe } from '../services/api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);
  const mounted = useRef(true);

  const fetchRole = async () => {
    setRoleLoading(true);
    try {
      const res = await apiGetMe();
      const newRole = res?.profile?.role || res?.user?.role || null;
      const paid = res?.user?.hasPaid ?? res?.profile?.hasPaid ?? false;
      if (mounted.current) {
        setRole(newRole);
        setHasPaid(Boolean(paid));
      }
      return { role: newRole, hasPaid: Boolean(paid) };
    } catch (error) {
      if (mounted.current) {
        setRole(null);
        setHasPaid(false);
      }
      return { role: null, hasPaid: false };
    } finally {
      if (mounted.current) setRoleLoading(false);
    }
  };

  useEffect(() => {
    mounted.current = true;

    const restoreSession = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionData = data?.session;
      if (!mounted.current) return;
      setSession(sessionData);
      setUser(sessionData?.user ?? null);

      if (sessionData?.access_token) {
        localStorage.setItem('token', sessionData.access_token);
        await fetchRole();
      }

      if (mounted.current) setLoading(false);
    };

    restoreSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, sessionData) => {
      if (!mounted.current) return;

      setSession(sessionData);
      setUser(sessionData?.user ?? null);

      if (event === 'SIGNED_IN') {
        const signedUser = sessionData?.user;
        if (signedUser?.identities?.some((identity) => identity.provider === 'google')) {
          try {
            const backendRes = await apiGoogleLogin(signedUser);
            const newRole = backendRes?.user?.role || null;
            const paid = backendRes?.user?.hasPaid ?? false;
            if (mounted.current) {
              setRole(newRole);
              setHasPaid(Boolean(paid));
            }
          } catch (err) {
            console.warn('[Auth] Google login exchange failed:', err?.message);
          }
        }
      }

      if (event === 'SIGNED_OUT') {
        if (mounted.current) {
          setRole(null);
          setHasPaid(false);
          setUser(null);
        }
        localStorage.removeItem('token');
      }
    });

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const token = data?.session?.access_token;
    if (token) localStorage.setItem('token', token);

    const res = await apiLogin(email, password);
    const backendUser = res?.data?.user || res?.user || {};
    const newRole = backendUser?.role || null;
    const paid = backendUser?.hasPaid ?? false;

    if (mounted.current) {
      setUser({ ...data.user, role: newRole, hasPaid: paid });
      setSession(data.session);
      setRole(newRole);
      setHasPaid(Boolean(paid));
    }

    return { ...data, backendRole: newRole };
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
    return data;
  };

  const markPaid = async () => {
    if (mounted.current) setHasPaid(true);
    setUser((prevUser) => (prevUser ? { ...prevUser, hasPaid: true } : prevUser));
    if (supabase) {
      const { error } = await supabase.auth.updateUser({ data: { hasPaid: true } });
      if (error) console.warn('[Auth] Could not persist payment flag:', error.message);
    }
  };

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut().catch(() => {});
    if (mounted.current) {
      setUser(null);
      setRole(null);
      setHasPaid(false);
    }
    localStorage.removeItem('token');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    if (role === 'admin') return '/admin';
    if (role === 'instructor') return '/instructor/dashboard';
    return '/dashboard/dashboard';
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    role,
    hasPaid,
    roleLoading,
    signInWithEmail,
    signInWithGoogle,
    markPaid,
    signOut,
    getDashboardPath,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
