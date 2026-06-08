import React from 'react';
import styles from './Sidebar.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { MdDashboard, MdWork, MdLeaderboard } from 'react-icons/md';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { FaUser, FaRobot, FaChartBar, FaFolderOpen } from 'react-icons/fa';
import { BsBriefcaseFill } from 'react-icons/bs';
import { LogOut } from 'lucide-react';
import logo from '../../../assets/images/logo.png';

import { useAuth } from '../../../context/AuthContext';


const STUDENT_LINKS = [
  { to: '/dashboard/dashboard',    icon: <MdDashboard />,       label: 'Dashboard' },
  { to: '/dashboard/profile',      icon: <FaUser />,             label: 'Profile' },
  { to: '/dashboard/roadmap',      icon: <MdWork />,             label: 'Roadmap' },
  { to: '/dashboard/chatbot',      icon: <FaRobot />,            label: 'AI Chatbot' },
  { to: '/dashboard/progress',     icon: <FaChartBar />,         label: 'Progress' },
  { to: '/dashboard/softSkills',   icon: <FaUser />,             label: 'Soft Skills' },
  { to: '/dashboard/ranking',      icon: <MdLeaderboard />,      label: 'Ranking' },
  { to: '/dashboard/jobs',         icon: <BsBriefcaseFill />,    label: 'Jobs' },
  { to: '/dashboard/projects',     icon: <FaFolderOpen />,       label: 'Projects' },
  { to: '/dashboard/community',    icon: <HiOutlineUserGroup />, label: 'Community' },
  { to: '/dashboard/careertwin',   icon: <FaRobot />,            label: 'Career Twin' },
  { to: '/dashboard/live-session', icon: <FaRobot />,            label: 'Live Session' },
];

const JOB_SEEKER_LINKS = [
  { to: '/dashboard/dashboard',  icon: <MdDashboard />,       label: 'Dashboard' },
  { to: '/dashboard/profile',    icon: <FaUser />,             label: 'Profile' },
  { to: '/dashboard/jobs',       icon: <BsBriefcaseFill />,    label: 'Jobs' },
  { to: '/dashboard/projects',   icon: <FaFolderOpen />,       label: 'Projects' },
  { to: '/dashboard/chatbot',    icon: <FaRobot />,            label: 'AI Chatbot' },
  { to: '/dashboard/ranking',    icon: <MdLeaderboard />,      label: 'Ranking' },
  { to: '/dashboard/community',  icon: <HiOutlineUserGroup />, label: 'Community' },
  { to: '/dashboard/careertwin', icon: <FaRobot />,            label: 'Career Twin' },
];

export default function Sidebar() {

  const { role, signOut } = useAuth();

  const navigate = useNavigate();

  const links = role === 'job_seeker' ? JOB_SEEKER_LINKS : STUDENT_LINKS;


  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };


  return (
    <div className={styles.sidebar}>
      <h2 className={styles.logo}>
        <img src={logo} alt="logo" /> Career Tech
      </h2>

      <nav className={styles.nav}>
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.link}${isActive ? ` ${styles.active}` : ''}`
            }
          >
            {icon} {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleSignOut}
        style={{
          marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px',
          background: 'none', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px', padding: '10px 14px', color: '#9ca3af',
          cursor: 'pointer', fontSize: '0.875rem', width: '100%',
        }}
      >
        <LogOut size={16} /> Sign Out
      </button>
    </div>
  );
}
