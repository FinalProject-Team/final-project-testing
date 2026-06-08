/**
 * communityAuth.js
 * 
 * Community components import useAuth from here.
 * This module adapts the main project's AuthContext into the
 * community-compatible shape: { user: { id, name, avatar, role, level, xp, xpMax, verified }, loading }
 */
import { useMemo } from 'react';
import { useAuth as useMainAuth } from './AuthContext';

export function useAuth() {
  const { user: mainUser, loading, signOut } = useMainAuth();

  const user = useMemo(() => {
    if (!mainUser) return null;
    return {
      id:       mainUser.id || 'local_user',
      name:     mainUser.user_metadata?.full_name
                  || mainUser.user_metadata?.name
                  || mainUser.email?.split('@')[0]
                  || 'User',
      avatar:   mainUser.user_metadata?.avatar_url
                  || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(mainUser.email || 'user')}`,
      role:     mainUser.user_metadata?.title || 'CareerTech Member',
      level:    12,
      xp:       820,
      xpMax:    1200,
      verified: false,
    };
  }, [mainUser]);

  // Provide logout compatible with community Navbar usage
  const logout = () => signOut?.();

  return { user, loading, logout };
}
