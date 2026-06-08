import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, GraduationCap } from 'lucide-react';
import styles from './AdminSidebar.module.css';

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <div className={`${styles.sidebar} d-flex flex-column justify-content-between p-3`}>
      <div>
        <div className={`${styles.logoContainer} d-flex align-items-center gap-3 pb-3 mb-4`}>
          <div className={styles.logoIcon}>
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className={styles.logoTitle}>Career Tech Admin</h1>
            <span className={styles.logoSubtitle}>Management Portal</span>
          </div>
        </div>

        <nav className="d-flex flex-column gap-1">
          {/* 1️⃣ التعديل هنا: أضفنا /admin/ قبل admindashboard وظبطنا الـ active */}
          <Link 
            to="/admin/admindashboard" 
            className={`${styles.navLink} ${location.pathname === '/admin/admindashboard' ? styles.activeLink : ''}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          {/* 2️⃣ هنا المسار /admin/users سليم، بس اتأكدي إن الـ active شغال تمام */}
          <Link 
            to="/admin/users" 
            className={`${styles.navLink} ${location.pathname === '/admin/users' ? styles.activeLink : ''}`}
          >
            <Users size={20} />
            <span>Users</span>
          </Link>

          <Link 
            to="/admin/courses" 
            className={`${styles.navLink} ${location.pathname === '/admin/courses' ? styles.activeLink : ''}`}
          >
            <BookOpen size={20} />
            <span>Courses</span>
          </Link>

          <Link 
            to="/admin/lessons" 
            className={`${styles.navLink} ${location.pathname === '/admin/lessons' ? styles.activeLink : ''}`}
          >
            <GraduationCap size={20} />
            <span>Lessons</span>
          </Link>
        </nav>
      </div>

      <div className={`${styles.statusContainer} p-3 rounded-3`}>
        <span className="text-secondary d-block mb-1" style={{ fontSize: '0.75rem' }}>System Status</span>
        <div className="d-flex align-items-center gap-2 text-white fw-medium font-sm">
          <span className={styles.statusDot}></span>
          <span style={{ color: '#34d399', fontSize: '0.875rem' }}>Operational</span>
        </div>
      </div>
    </div>
  );
}