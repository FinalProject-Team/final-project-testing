import React from 'react';
import styles from './ProfileMetrics.module.css';
import { TrendingUp, Flame, Target, Award } from 'lucide-react';

const ProfileMetrics = ({ data }) => {
  const overall = data?.overall_progress ?? 43;
  const streak = data?.current_streak ?? 7;
  const xp = data?.total_xp_this_month ?? 4820;
  const certs = data?.certificates_count ?? 2;

  const stats = [
    {
      id: 1,
      value: `${overall}%`,
      title: 'Overall Progress',
      subText: 'of track complete',
      icon: <TrendingUp size={18} color="#06b6d4" />,
      iconClass: styles.blueIcon,
    },
    {
      id: 2,
      value: `${streak} days`,
      title: 'Current Streak',
      subText: 'Keep it going!',
      icon: <Flame size={18} color="#f59e0b" />,
      iconClass: styles.orangeIcon,
    },
    {
      id: 3,
      value: xp.toLocaleString(),
      title: 'XP This Month',
      subText: '+38% vs last',
      icon: <Target size={18} color="#0891b2" />,
      iconClass: styles.cyanIcon,
    },
    {
      id: 4,
      value: certs.toString(),
      title: 'Certificates',
      subText: '1 in progress',
      icon: <Award size={18} color="#a855f7" />,
      iconClass: styles.purpleIcon,
    },
  ];

  return (
    <div className={styles.statsContainer}>
      {stats.map((item) => (
        <div key={item.id} className={styles.statCard}>
          <div className={`${styles.iconBox} ${item.iconClass}`}>
            {item.icon}
          </div>
          <div className={styles.cardData}>
            <h3 className={styles.mainValue}>{item.value}</h3>
            <p className={styles.statTitle}>{item.title}</p>
            <p className={styles.subTextGreen}>{item.subText}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileMetrics;