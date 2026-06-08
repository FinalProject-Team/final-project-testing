import { BookOpen, Code2, Target } from 'lucide-react';
import { statsData as FALLBACK } from './statsData.js';
import styles from './StatsCards.module.css';

const iconMap = { book: BookOpen, code: Code2, target: Target };

function toStatItems(apiStats) {
  if (!apiStats) return null;
  return [
    {
      id: 'lessons', icon: 'book',
      current: apiStats.lessonsCompleted ?? apiStats.lessons_done ?? FALLBACK[0].current,
      total:   apiStats.totalLessons     ?? apiStats.total_lessons ?? FALLBACK[0].total,
      label:   'Lessons Completed', color: 'cyan',
    },
    {
      id: 'challenges', icon: 'code',
      current: apiStats.challengesDone  ?? FALLBACK[1].current,
      total:   apiStats.totalChallenges ?? FALLBACK[1].total,
      label:   'Coding Challenges', color: 'cyan',
    },
    {
      id: 'xp', icon: 'target',
      current: apiStats.xp?.today   ?? apiStats.xp_today   ?? FALLBACK[2].current,
      total:   apiStats.xp?.weekly  ?? apiStats.xp_weekly  ?? FALLBACK[2].total,
      label:   'Weekly XP Goal', color: 'purple',
    },
  ];
}

function StatCard({ stat, index }) {
  const Icon = iconMap[stat.icon];
  const pct  = stat.total ? Math.min(100, Math.round((stat.current / stat.total) * 100)) : 0;
  return (
    <div className={styles.card} style={{ animationDelay: `${index * 0.1}s` }}>
      <div className={styles.cardTop}>
        <div className={`${styles.iconWrap} ${styles[stat.color]}`}><Icon size={16} /></div>
        <span className={`${styles.pct} ${styles[stat.color]}`}>{pct}%</span>
      </div>
      <div className={styles.numbers}>{stat.current} / {stat.total}</div>
      <div className={styles.label}>{stat.label}</div>
      <div className={styles.bar}>
        <div className={`${styles.fill} ${styles[stat.color + 'Fill']}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function StatsCards({ apiStats }) {
  const data = toStatItems(apiStats) || FALLBACK;
  return (
    <div className={styles.grid}>
      {data.map((stat, i) => <StatCard key={stat.id} stat={stat} index={i} />)}
    </div>
  );
}
