import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, UserCheck, BookOpen, FileText, TrendingUp, Activity } from 'lucide-react';
import styles from './AdminDashboard.module.css';
import api from './adminApi';

export default function AdminDashboard() {
  // 1️⃣ تعريف الـ States لتخزين البيانات وحالة التحميل
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLessons: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  // 2️⃣ استدعاء الـ API عند فتح الصفحة
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        // نداء على الـ URL المظبوط بناءً على السواجر
        const response = await api.get('/api/admin/dashboard');
        
        // حفظ الداتا اللي راجعة جوه الـ state
        if (response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching admin dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // 3️⃣ توزيع الداتا الحقيقية على الـ الكروت
  const cards = [
    { title: 'Total Users', count: stats.totalUsers, icon: <Users size={22} />, bgClass: styles.bgCyan },
    { title: 'Students', count: stats.totalUsers, icon: <GraduationCap size={22} />, bgClass: styles.bgEmerald }, // تقدري تعدليها لو الـ API بقى يرجع طلاب منفصلين
    { title: 'Instructors', count: 1, icon: <UserCheck size={22} />, bgClass: styles.bgOrange }, // داتا افتراضية أو تعدل لاحقاً
    { title: 'Total Courses', count: stats.totalCourses, icon: <BookOpen size={22} />, bgClass: styles.bgIndigo },
    { title: 'Total Lessons', count: stats.totalLessons, icon: <FileText size={22} />, bgClass: styles.bgCyanDark },
  ];

  // شكل لطيف أثناء التحميل بدل ما تظهر أصفار فجأة
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh', color: 'white' }}>
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading Dashboard Data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className="mb-4">
        <h2 className={`h4 ${styles.title}`}>Dashboard Overview</h2>
        <p className={styles.subtitle}>Welcome back! Here's what's happening with your platform.</p>
      </div>

      <div className="row g-3 mb-4 flex-nowrap overflow-auto">
        {cards.map((card, i) => (
          <div key={i} className="col" style={{ minWidth: '200px' }}>
            <div className={`${styles.statCard} p-3 d-flex align-items-center justify-content-between`}>
              <div>
                <span className={`${styles.cardTitle} d-block mb-1`}>{card.title}</span>
                <span className={styles.cardCount}>{card.count}</span>
              </div>
              <div className={`${styles.iconBox} ${card.bgClass}`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-md-8">
          <div className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>Platform Activity</h3>
            <div>
              <div className={styles.activityRow}>
                <div className="d-flex align-items-center gap-3">
                  <span className={styles.bullet} style={{ backgroundColor: '#34d399' }}></span>
                  <span className="text-secondary" style={{ fontSize: '0.875rem' }}>New users registered today</span>
                </div>
                <span className="fw-bold text-dark" style={{ fontSize: '0.875rem' }}>{stats.totalUsers}</span>
              </div>
              <div className={styles.activityRow}>
                <div className="d-flex align-items-center gap-3">
                  <span className={styles.bullet} style={{ backgroundColor: '#22d3ee' }}></span>
                  <span className="text-secondary" style={{ fontSize: '0.875rem' }}>Courses published</span>
                </div>
                <span className="fw-bold text-dark" style={{ fontSize: '0.875rem' }}>{stats.totalCourses}</span>
              </div>
              <div className={styles.activityRow}>
                <div className="d-flex align-items-center gap-3">
                  <span className={styles.bullet} style={{ backgroundColor: '#818cf8' }}></span>
                  <span className="text-secondary" style={{ fontSize: '0.875rem' }}>Lessons completed</span>
                </div>
                <span className="fw-bold text-dark" style={{ fontSize: '0.875rem' }}>{stats.totalLessons}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>Quick Stats</h3>
            <div className="row g-3">
              <div className="col-6">
                <div className={`${styles.quickStatBox} ${styles.growthBox}`}>
                  <TrendingUp style={{ color: '#06b6d4', marginBottom: '12px' }} size={20} />
                  <span className="text-muted d-block mb-1" style={{ fontSize: '0.75rem' }}>Growth Rate</span>
                  <span className="fw-bold" style={{ color: '#0891b2', fontSize: '1.125rem' }}>+12.5%</span>
                </div>
              </div>
              <div className="col-6">
                <div className={`${styles.quickStatBox} ${styles.activeUsersBox}`}>
                  <Activity style={{ color: '#10b981', marginBottom: '12px' }} size={20} />
                  <span className="text-muted d-block mb-1" style={{ fontSize: '0.75rem' }}>Active Users</span>
                  <span className="fw-bold" style={{ color: '#059669', fontSize: '1.125rem' }}>{stats.totalUsers}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}