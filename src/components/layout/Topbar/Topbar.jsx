import { useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { IoNotificationsOutline } from 'react-icons/io5';
import { useAuth } from '../../../context/AuthContext';
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
};

export default function Topbar() {
  const location = useLocation();
  const { user } = useAuth();

  const title = PAGE_TITLES[location.pathname] ?? 'Dashboard';
  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className={styles.topbar}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.rightSection}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input type="text" placeholder="Search..." />
        </div>

        <div className={styles.notification}>
          <IoNotificationsOutline />
        </div>

        <div className={styles.profile} title={user?.email ?? ''}>
          <img src={profileImg} alt="profile" />
        </div>
      </div>
    </div>
  );
}
