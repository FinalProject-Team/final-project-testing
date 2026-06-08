import styles from './StatsCards.module.css';

export default function StatsCards({ stats = [] }) {
  return (
    <div className={styles.row}>
      {stats.map((s) => (
        <div key={s.label} className={styles.card}>
          <span className={styles.value} style={{ color: s.color }}>
            {s.value}
          </span>
          <span className={styles.label}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}
