import { Bell, Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import logoDark from '../../assets/images/logo.png';
import logoLight from '../../assets/images/logolight.png';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { apiGetMe, apiGetNotifications, apiMarkNotificationRead, apiMarkAllNotificationsRead } from '../../services/api/api';

export default function Navbar() {
  const { theme, toggle }                       = useTheme();
  const [isOpen, setIsOpen]                     = useState(false);
  const { isAuthenticated, role, signOut, getDashboardPath } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  // ── Real user data from API ───────────────────────────────────────────────
  const [userName, setUserName]   = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // ── Notifications ─────────────────────────────────────────────────────────
  const [unreadCount, setUnreadCount]           = useState(0);
  const [notifications, setNotifications]       = useState([]);
  const [notifOpen, setNotifOpen]               = useState(false);
  const notifRef = useRef(null);

  // ── Fetch user info on mount / auth change ────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) { setUserName(''); setAvatarUrl(''); setUnreadCount(0); return; }

    let cancelled = false;

    const loadUser = async () => {
      try {
        const me = await apiGetMe();
        if (cancelled) return;
        const raw = me?.user || me?.profile || me;
        const name = raw?.full_name || raw?.name || raw?.email?.split('@')[0] || '';
        setUserName(name.split(' ')[0] || name); // first name only
        setAvatarUrl(raw?.avatar_url || '');
      } catch (_) {}
    };

    const loadNotifications = async () => {
      try {
        const list = await apiGetNotifications();
        if (cancelled) return;
        setNotifications(list);
        setUnreadCount(list.filter(n => !n.read && !n.is_read).length);
      } catch (_) {}
    };

    loadUser();
    loadNotifications();

    return () => { cancelled = true; };
  }, [isAuthenticated]);

  // ── Close notifications panel when clicking outside ───────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleNotifClick = async () => {
    setNotifOpen(v => !v);
    // Mark all read when opening panel
    if (!notifOpen && unreadCount > 0) {
      try {
        await apiMarkAllNotificationsRead();
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, read: true, is_read: true })));
      } catch (_) {}
    }
  };

  const markSingleRead = async (id) => {
    try {
      await apiMarkNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (_) {}
  };

  const handleJobsClick = () => {
    const publicPath = '/jobs';
    if (isAuthenticated) {
      navigate(publicPath);
    } else {
      // remember where to return after login and send user to login
      sessionStorage.setItem('returnPath', publicPath);
      navigate('/login', { state: { from: { pathname: publicPath } } });
    }
  };

  // ── Active link helper ────────────────────────────────────────────────────
  const isActive = (hash) => location.hash === hash;

  const navItems = [
    { href: '#home',    label: 'Home' },
    { href: '#courses', label: 'Courses' },
    { href: '#about',   label: 'About' },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>

        {/* Logo */}
        <div className={styles.logoSection}>
          <Link to="/" className={styles.logo} style={{ textDecoration: 'none' }} onClick={() => setIsOpen(false)}>
            {theme === 'dark' ? (
              <img src={logoDark} alt="CareerTech" className={styles.logoImg} />
            ) : (
              <img src={logoLight} alt="CareerTech" className={styles.logoImg} />
            )}
            <span>CareerTech</span>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className={styles.menuToggle}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Nav links */}
        <div className={`${styles.navLinks} ${isOpen ? styles.active : ''}`}>
          {navItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? styles.navLinkActive : ''}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Auth / user section */}
        <div className={styles.authButtons}>

          {/* Apply Job Button */}
          <button
            className={styles.applyJobBtn}
            onClick={handleJobsClick}
            title={isAuthenticated ? "View Jobs" : "Register to apply for jobs"}
          >
             Apply Job
          </button>

          {/* Theme toggle */}
          <button
            className={styles.themeToggle}
            onClick={toggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            <>
              {/* Notifications bell */}
              <div className={styles.notifWrapper} ref={notifRef}>
                <button
                  className={styles.notifBtn}
                  onClick={handleNotifClick}
                  aria-label={`${unreadCount} unread notifications`}
                  title="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className={styles.notifBadge}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications dropdown */}
                {notifOpen && (
                  <div className={styles.notifDropdown}>
                    <div className={styles.notifHeader}>
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <span className={styles.notifCount}>{unreadCount} new</span>
                      )}
                    </div>
                    <div className={styles.notifList}>
                      {notifications.length === 0 ? (
                        <div className={styles.notifEmpty}>No notifications yet</div>
                      ) : (
                        notifications.slice(0, 8).map(n => (
                          <div
                            key={n.id}
                            className={`${styles.notifItem} ${(!n.read && !n.is_read) ? styles.notifUnread : ''}`}
                            onClick={() => markSingleRead(n.id)}
                          >
                            <div className={styles.notifDot} />
                            <div className={styles.notifText}>
                              <p>{n.message || n.content || n.title || 'New notification'}</p>
                              <span>{n.created_at ? new Date(n.created_at).toLocaleDateString() : ''}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User avatar + name + dashboard link */}
              <div className={styles.userChip}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt={userName} className={styles.userAvatar} />
                ) : (
                  <div className={styles.userAvatarFallback}>
                    {userName ? userName[0].toUpperCase() : '?'}
                  </div>
                )}
                <Link to={getDashboardPath()} className={styles.userNameLink}>
                  {userName || 'Dashboard'}
                </Link>
              </div>

              <button className={styles.signupBtn} onClick={handleSignOut}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className={styles.loginBtn}>Login</Link>
              <Link to="/register" className={styles.signupBtn}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
