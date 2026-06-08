/**
 * ProtectedRoute
 *
 * Props:
 *   allowedRoles?    string[]  – if omitted, any authenticated user passes
 *   requirePayment?  boolean   – if true, student must have paid; redirects to '/' otherwise
 *   redirectTo?      string    – where to send unauthenticated users (default: /login)
 */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Spinner = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', background: '#020817', flexDirection: 'column', gap: '16px',
  }}>
    <div style={{
      width: '40px', height: '40px', border: '3px solid rgba(0,212,255,0.2)',
      borderTop: '3px solid #00d4ff', borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Loading…</span>
  </div>
);

export default function ProtectedRoute({
  children,
  allowedRoles,
  requirePayment = false,
  redirectTo = '/login',
}) {
  const { isAuthenticated, role, hasPaid, loading, roleLoading } = useAuth();
  const location = useLocation();

  // 1. Still resolving auth state — show spinner
  if (loading || roleLoading) return <Spinner />;

  // 2. Not logged in → send to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }


  // 3. Role not yet known (backend slow/offline) — still loading
  //    Only block if we need to role-check AND role is null
  if (allowedRoles && allowedRoles.length > 0 && role === null) {
    // Role is still being fetched from backend — show loading state instead of redirecting.
    return <Spinner />;
  }
  // 4. Wrong role → redirect to user's own dashboard
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (role === 'admin')      return <Navigate to="/admin" replace />;
    if (role === 'instructor') return <Navigate to="/instructor/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  // 5. Dashboard requires payment (student only)
  //    job_seeker / instructor / admin always bypass this check
  if (requirePayment && role === 'student' && !hasPaid) {
    return <Navigate to="/payment" state={{ from: location }} replace />;
  }

  return children;
}
