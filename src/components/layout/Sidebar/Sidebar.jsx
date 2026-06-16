import React from 'react';
import styles from './Sidebar.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { MdDashboard, MdWork, MdLeaderboard, MdMessage } from 'react-icons/md';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { FaUser, FaRobot, FaChartBar, FaFolderOpen, FaBriefcase } from 'react-icons/fa';
import { BsBriefcaseFill } from 'react-icons/bs';
import { LogOut } from 'lucide-react';
import logo from '../../../assets/images/logo.png';

import { useAuth } from '../../../context/AuthContext';

const STUDENT_LINKS = [
  { to: '/dashboard/dashboard',    icon: <MdDashboard size={18} />,      label: 'Dashboard' },
  { to: '/dashboard/profile',      icon: <FaUser size={16} />,           label: 'Profile' },
  { to: '/dashboard/roadmap',      icon: <MdWork size={18} />,           label: 'Roadmap' },
  { to: '/dashboard/chatbot',      icon: <FaRobot size={16} />,          label: 'AI Chatbot' },
  { to: '/dashboard/progress',     icon: <FaChartBar size={16} />,       label: 'Progress' },
  { to: '/dashboard/softSkills',   icon: <FaUser size={16} />,           label: 'Soft Skills' },
  { to: '/dashboard/ranking',      icon: <MdLeaderboard size={18} />,    label: 'Ranking' },
  { to: '/dashboard/jobs',         icon: <BsBriefcaseFill size={16} />,  label: 'Jobs' },
  { to: '/dashboard/projects',     icon: <FaFolderOpen size={16} />,     label: 'Projects' },
  { to: '/dashboard/community',    icon: <HiOutlineUserGroup size={18} />,label: 'Community' },
  { to: '/dashboard/careertwin',   icon: <FaRobot size={16} />,          label: 'Career Twin' },
  { to: '/dashboard/live-session', icon: <FaRobot size={16} />,          label: 'Live Session' },
  { to: '/dashboard/my-chats',     icon: <MdMessage size={18} />,        label: 'Messages' },
];

const EMPLOYER_LINKS = [
  { to: '/dashboard/employer',       icon: <FaBriefcase size={16} />,      label: 'Employer Dashboard' },
  { to: '/dashboard/my-jobs',        icon: <FaBriefcase size={16} />,      label: 'My Jobs' },
  { to: '/dashboard/applications',   icon: <FaFolderOpen size={16} />,     label: 'Applications' },
  { to: '/dashboard/my-chats',       icon: <MdMessage size={18} />,        label: 'Messages' },
];

// normal_user: can browse jobs, apply, view status, and chat if accepted
const NORMAL_USER_LINKS = [
  { to: '/dashboard/normal-user', icon: <MdDashboard size={18} />,      label: 'Dashboard' },
  { to: '/dashboard/profile',      icon: <FaUser size={16} />,           label: 'Profile' },
  { to: '/dashboard/jobs',         icon: <BsBriefcaseFill size={16} />,  label: 'Browse Jobs' },
  { to: '/dashboard/my-chats',     icon: <MdMessage size={18} />,        label: 'Messages' },
];

export default function Sidebar() {
  const { role, signOut, user } = useAuth();
  const navigate = useNavigate();

  const links =
    role === 'employer'      ? EMPLOYER_LINKS :
    role === 'job_seeker'   ? NORMAL_USER_LINKS :
    role === 'normal_user'  ? NORMAL_USER_LINKS :
    STUDENT_LINKS;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Role badge display
  const roleBadge = {
    student:     { label: 'Student',     color: '#38bdf8' },
    job_seeker:  { label: 'Job Seeker',  color: '#a78bfa' },
    normal_user: { label: 'User',        color: '#34d399' },
    instructor:  { label: 'Instructor',  color: '#fb923c' },
    admin:       { label: 'Admin',       color: '#f87171' },
  }[role] || { label: role || 'User', color: '#94a3b8' };

  return (
    <div className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logoWrapper}>
        <img src={logo} alt="logo" className={styles.logoImg} />
        <span className={styles.logoText}>Career Tech</span>
      </div>

      {/* User badge */}
      <div className={styles.userBadge}>
        <div className={styles.userAvatar}>
          {(user?.email?.[0] || 'U').toUpperCase()}
        </div>
        <div className={styles.userInfo}>
          <span className={styles.userEmail}>{user?.email?.split('@')[0] || 'User'}</span>
          <span className={styles.roleTag} style={{ color: roleBadge.color }}>
            {roleBadge.label}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Nav links */}
      <nav className={styles.nav}>
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.link}${isActive ? ` ${styles.active}` : ''}`
            }
          >
            <span className={styles.linkIcon}>{icon}</span>
            <span className={styles.linkLabel}>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Sign out */}
      <button onClick={handleSignOut} className={styles.signOutBtn}>
        <LogOut size={16} />
        <span>Sign Out</span>
      </button>
    </div>
  );
}
