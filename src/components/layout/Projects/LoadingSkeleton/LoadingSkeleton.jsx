import styles from './LoadingSkeleton.module.css';

function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.imgSkel} />
      <div className={styles.body}>
        <div className={`${styles.line} ${styles.short}`} style={{ marginBottom: 16 }} />
        <div className={`${styles.line} ${styles.long}`} />
        <div className={`${styles.line} ${styles.medium}`} style={{ marginBottom: 20 }} />
        <div className={`${styles.line} ${styles.short}`} />
      </div>
    </div>
  );
}

export default function LoadingSkeleton({ count = 4 }) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
