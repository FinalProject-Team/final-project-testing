/**
 * CommunityAuthBridge
 * 
 * Adapts the main project's AuthContext into the shape
 * that Community components expect: { user, loading }
 * where user has: { id, name, avatar, role, level, xp, xpMax, verified }
 */
import { createContext, useContext, useMemo } from 'react';
import { useAuth as useMainAuth } from './AuthContext';

const CommunityUserContext = createContext(null);

export function CommunityAuthProvider({ children }) {
  const { user: mainUser, loading } = useMainAuth();

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

  return (
    <CommunityUserContext.Provider value={{ user, loading }}>
      {children}
    </CommunityUserContext.Provider>
  );
}

export function useCommunityAuth() {
  const ctx = useContext(CommunityUserContext);
  if (!ctx) throw new Error('useCommunityAuth must be inside CommunityAuthProvider');
  return ctx;
}
