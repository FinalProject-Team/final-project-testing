import React, { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, Users } from 'lucide-react';
import styles from './AdminDashboard.module.css';
import api from './adminApi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLessons: 0,
    totalStudents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/api/admin/dashboard');
        if (response.data) {
          setStats({
            totalCourses: response.data.totalCourses ?? 0,
            totalLessons: response.data.totalLessons ?? 0,
            totalStudents: response.data.totalStudents ?? 0,
          });
        }
      } catch (err) {
        console.error('Error fetching admin dashboard stats:', err);
        setError('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  const cards = [
    {
      key: 'totalCourses',
      label: 'Total Courses',
      value: stats.totalCourses,
      icon: <BookOpen size={20} />,
      iconBg: styles.bgCyan,
    },
    {
      key: 'totalLessons',
      label: 'Total Lessons',
      value: stats.totalLessons,
      icon: <GraduationCap size={20} />,
      iconBg: styles.bgIndigo,
    },
    {
      key: 'totalStudents',
      label: 'Total Students',
      value: stats.totalStudents,
      icon: <Users size={20} />,
      iconBg: styles.bgEmerald,
    },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <div className="mb-4">
        <h2 className={`h4 ${styles.title}`}>Admin Dashboard</h2>
        <p className={styles.subtitle}>Platform-wide statistics and overview.</p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row g-3 mb-4">
        {cards.map((card) => (
          <div className="col-12 col-md-4" key={card.key}>
            <div className={`${styles.statCard} p-3 d-flex align-items-center justify-content-between`}>
              <div>
                <div className={styles.cardTitle}>{card.label}</div>
                <div className={styles.cardCount}>{card.value}</div>
              </div>
              <div className={`${styles.iconBox} ${card.iconBg}`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.sectionCard}>
        <h3 className={styles.sectionTitle}>Platform Overview</h3>

        <div className={styles.activityRow}>
          <span>Total Courses</span>
          <span className="fw-semibold">{stats.totalCourses}</span>
        </div>
        <div className={styles.activityRow}>
          <span>Total Lessons</span>
          <span className="fw-semibold">{stats.totalLessons}</span>
        </div>
        <div className={styles.activityRow}>
          <span>Total Students</span>
          <span className="fw-semibold">{stats.totalStudents}</span>
        </div>
      </div>
    </div>
  );
}
