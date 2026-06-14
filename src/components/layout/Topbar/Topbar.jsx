import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { IoNotificationsOutline } from 'react-icons/io5';
import { useAuth } from '../../../context/AuthContext';
import {
  apiGetNotifications,
  apiGetUnreadNotificationCount,
  apiMarkAllNotificationsRead,
  apiMarkNotificationRead,
} from '../../../services/api/api';
import styles from './Topbar.module.css';
import profileImg from '../../../assets/images/profile.png';

const PAGE_TITLES = {
  '/dashboard/dashboard':  'Dashboard',
  '/dashboard/profile':    'My Profile',
  '/dashboard/roadmap':    'My Roadmap',
  '/dashboard/chatbot':    'AI Career Advisor',
  '/dashboard/softSkills': 'Soft Skills',
  '/dashboard/ranking':    'Leaderboard',
  '/dashboard/jobs':       'Job Board',
  '/dashboard/projects':   'My Projects',
  '/dashboard/community':  'Community',
  '/dashboard/careertwin': 'Career Twin',
  '/dashboard/progress':   'My Progress',
  '/dashboard/live-session':'Live Sessions',
  '/jobs':                 'Job Board',
};

export default function Topbar({ title: customTitle, searchValue, onSearchChange, metaLabel }) {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const title = customTitle ?? PAGE_TITLES[location.pathname] ?? 'Dashboard';
  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'U';

  useEffect(() => {
    let isMounted = true;

    if (!isAuthenticated) {
      setUnreadCount(0);
      setNotifications([]);
      setNotifOpen(false);
      return;
    }

    const loadNotifications = async () => {
      try {
        const list = await apiGetNotifications();
        if (!isMounted) return;
        setNotifications(list);
        setUnreadCount(list.filter((n) => !n.read && !n.is_read).length);
      } catch {
        if (isMounted) setUnreadCount(0);
      }
    };

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotifClick = async () => {
    const nextOpen = !notifOpen;
    setNotifOpen(nextOpen);

    if (nextOpen && unreadCount > 0) {
      try {
        await apiMarkAllNotificationsRead();
        setNotifications((prev) => prev.map((note) => ({
          ...note,
          read: true,
          is_read: true,
        })));
        setUnreadCount(0);
      } catch {
        // ignore mark failures
      }
    }
  };

  const markSingleRead = async (id) => {
    try {
      await apiMarkNotificationRead(id);
      setNotifications((prev) => prev.map((note) =>
        note.id === id ? { ...note, read: true, is_read: true } : note
      ));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // ignore error
    }
  };

  return (
    <div className={styles.topbar}>
      <div className={styles.leftSection}>
      <h2 className={styles.title}>{title}</h2>
        {metaLabel && <span className={styles.metaLabel}>{metaLabel}</span>}
      </div>

      <div className={styles.rightSection}>
        {typeof onSearchChange === 'function' && (
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchValue ?? ''}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        )}

        <div className={styles.notifWrapper} ref={notifRef}>
          <button
            className={styles.notification}
            type="button"
            onClick={handleNotifClick}
            aria-label={`${unreadCount} unread notifications`}
            title="Notifications"
          >
            <IoNotificationsOutline />
            {unreadCount > 0 && (
              <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>

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
                  notifications.slice(0, 8).map((note) => (
                    <button
                      key={note.id}
                      type="button"
                      className={`${styles.notifItem} ${(!note.read && !note.is_read) ? styles.notifUnread : ''}`}
                      onClick={() => markSingleRead(note.id)}
                    >
                      <span className={styles.notifDot} />
                      <div className={styles.notifText}>
                        <p>{note.message || note.content || note.title || 'New notification'}</p>
                        <span>{note.created_at ? new Date(note.created_at).toLocaleDateString() : ''}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className={styles.profile} title={user?.email ?? ''}>
          <img src={profileImg} alt="profile" />
        </div>
      </div>
    </div>
  );
}
