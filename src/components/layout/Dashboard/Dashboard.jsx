import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import { getDashboardStats } from '../services/dashboardServices';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px', color: 'white' }}>Loading Dashboard...</div>;
  }

  // حماية الكود من الكراش
  const displayData = stats || {
    user: { full_name: "Developer", level: "Mid-Level Developer" },
    scheduled: { lessons: 0, assessments: 0 },
    xp: { total: 0, today: 0 },
    courses: { done: 0, total: 0, percentage: 0 },
    jobs: { matches: 0, newToday: 0 },
    streak: { days: 0 }
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.welcomeBanner}>
        <div className={styles.welcomeText}>
          <span className={styles.badge}>{displayData.user?.level || "Mid-Level Developer"}</span>
          <h2>Good morning, {displayData.user?.full_name || "User"}! 👋</h2>
          <p>You have <span className={styles.highlightBlue}>{displayData.scheduled?.lessons} lessons</span> and <span className={styles.highlightYellow}>{displayData.scheduled?.assessments} assessment</span> scheduled today.</p>
        </div>
        <button className={styles.continueBtn}>
          Continue Learning <span>→</span>
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={`${styles.icon} ${styles.blueIcon}`}>⚡</span>
            <span className={styles.trendUp}>↗</span>
          </div>
          <h3>{displayData.xp?.total?.toLocaleString()}</h3>
          <p className={styles.statLabel}>Total XP</p>
          <span className={styles.statSub}>+{displayData.xp?.today} today</span>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={`${styles.icon} ${styles.cyanIcon}`}>📖</span>
            <span className={styles.trendUp}>↗</span>
          </div>
          <h3>{displayData.courses?.done}/{displayData.courses?.total}</h3>
          <p className={styles.statLabel}>Courses Done</p>
          <span className={styles.progressText}>{displayData.courses?.percentage}% complete</span>
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBarFill} style={{ width: `${displayData.courses?.percentage}%` }}></div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={`${styles.icon} ${styles.purpleIcon}`}>💼</span>
            <span className={styles.trendUp}>↗</span>
          </div>
          <h3>{displayData.jobs?.matches}</h3>
          <p className={styles.statLabel}>Job Matches</p>
          <span className={styles.statSubGreen}>{displayData.jobs?.newToday} new today</span>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={`${styles.icon} ${styles.yellowIcon}`}>⭐</span>
            <span className={styles.trendUp}>↗</span>
          </div>
          <h3>{displayData.streak?.days} days</h3>
          <p className={styles.statLabel}>Streak</p>
          <span className={styles.statSubGreen}>Personal best</span>
        </div>
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h4>XP This Week</h4>
            <span className={styles.percentageBadge}>+15% vs last week</span>
          </div>
          <div className={styles.svgContainer}>
            <svg viewBox="0 0 500 140" preserveAspectRatio="none" className={styles.lineChart}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00b4d8" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#00b4d8" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M 0 100 Q 125 130 250 70 T 500 80" fill="none" stroke="#00b4d8" strokeWidth="3" strokeLinecap="round" />
              <path d="M 0 100 Q 125 130 250 70 T 500 80 L 500 140 L 0 140 Z" fill="url(#chartGradient)" />
            </svg>
          </div>
          <div className={styles.chartDays}>
            <span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h4>Skill Overview</h4>
          <div className={styles.radarContainer}>
            <svg viewBox="0 0 200 200" className={styles.radarChart}>
              <polygon points="100,30 160,65 160,135 100,170 40,135 40,65" fill="none" stroke="#1f2937" strokeWidth="1" />
              <polygon points="100,50 140,73 140,127 100,150 60,127 60,73" fill="none" stroke="#1f2937" strokeWidth="1" />
              <polygon points="100,70 120,83 120,117 100,130 80,117 80,83" fill="none" stroke="#1f2937" strokeWidth="1" />
              <polygon className={styles.skillShape} points="100,50 145,73 130,127 100,140 70,110 55,73" fill="rgba(0, 180, 216, 0.2)" stroke="#00b4d8" strokeWidth="2" />
              <text x="100" y="22" textAnchor="middle" className={styles.radarLabel}>HTML/CSS</text>
              <text x="168" y="68" textAnchor="start" className={styles.radarLabel}>JavaScript</text>
              <text x="168" y="138" textAnchor="start" className={styles.radarLabel}>React</text>
              <text x="100" y="184" textAnchor="middle" className={styles.radarLabel}>TypeScript</text>
              <text x="32" y="138" textAnchor="end" className={styles.radarLabel}>Testing</text>
              <text x="32" y="68" textAnchor="end" className={styles.radarLabel}>Git</text>
            </svg>
          </div>
        </div>
      </div>

      <div className={styles.bottomGrid}>
        <div className={styles.bottomCard}>
          <div className={styles.cardHeaderWithIcon}>
            <h4>Today's Schedule</h4>
            <span className={styles.headerIcon}>🕒</span>
          </div>
          <div className={styles.scheduleItem}>
            <div className={styles.scheduleLeft}>
              <h5>React Hooks Deep Dive</h5>
              <span>10:00 AM</span>
            </div>
            <span className={`${styles.tag} ${styles.lessonTag}`}>Lesson</span>
          </div>
          <div className={styles.scheduleItem}>
            <div className={styles.scheduleLeft}>
              <h5>Weekly Assessment</h5>
              <span>2:00 PM</span>
            </div>
            <span className={`${styles.tag} ${styles.examTag}`}>Exam</span>
          </div>
          <div className={styles.scheduleItem}>
            <div className={styles.scheduleLeft}>
              <h5>Portfolio Review</h5>
              <span>4:30 PM</span>
            </div>
            <span className={`${styles.tag} ${styles.mentorTag}`}>Mentorship</span>
          </div>
        </div>

        <div className={styles.bottomCard}>
          <div className={styles.cardHeaderWithIcon}>
            <h4>Recent Activity</h4>
            <span className={styles.headerIcon}>🔔</span>
          </div>
          <div className={styles.activityItem}>
            <span className={`${styles.activityIcon} ${styles.blueCircle}`}>💻</span>
            <div className={styles.activityContent}>
              <p>Completed <strong>"CSS Grid"</strong> lesson</p>
              <span>2h ago</span>
            </div>
          </div>
          <div className={styles.activityItem}>
            <span className={`${styles.activityIcon} ${styles.yellowCircle}`}>🏅</span>
            <div className={styles.activityContent}>
              <p>Earned <strong>"Week Streak"</strong> badge</p>
              <span>5h ago</span>
            </div>
          </div>
        </div>

        <div className={styles.bottomCard}>
          <div className={styles.cardHeaderWithIcon}>
            <h4>Recommended Next</h4>
            <span className={styles.headerIcon}>🎯</span>
          </div>
          <ul className={styles.recommendList}>
            <li>
              <span className={styles.bulletBlue}>•</span>
              <p>Complete <strong>React Hooks</strong> module</p>
              <span className={styles.xpGain}>+120</span>
            </li>
            <li>
              <span className={styles.bulletYellow}>•</span>
              <p>Build <strong>Todo App</strong> project</p>
              <span className={styles.xpGain}>+250</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}