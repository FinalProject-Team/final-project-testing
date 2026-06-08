import styles from './RoadmapHero.module.css';

export default function Hero({ name = 'Alex', role = 'Mid-Level Developer', streak = 7, totalXp = 4820, xpToNext = 180 }) {
  const xpPercent = Math.round(((totalXp % 1000) / 1000) * 100);

  return (
    <section className={styles.hero}>
      <div className={styles.left}>
        <div className={styles.badge}>{role}</div>
        <h2 className={styles.heading}>
          Welcome back, {name}! <span className={styles.wave}>👋</span>
        </h2>
        <p className={styles.sub}>
          You&apos;re on a{' '}
          <span className={styles.streak}>{streak}-day streak</span>
          {' '}— keep it up!
        </p>
      </div>

      <div className={styles.right}>
        <div className={styles.xpNumber}>{totalXp.toLocaleString()}</div>
        <div className={styles.xpLabel}>Total XP</div>
        <div className={styles.xpBar}>
          <div className={styles.xpFill} style={{ width: `${xpPercent}%` }} />
        </div>
        <div className={styles.xpSub}>{xpToNext} XP to next milestone</div>
      </div>
    </section>
  );
}
