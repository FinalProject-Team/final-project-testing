import styles from './GridBackground.module.css';

export default function GridBackground() {
  return (
    <div className={styles.gridBackground}>
      <div className={styles.grid} />
      <div className={styles.glowBottom} />
    </div>
  );
}
