import styles from './EmptyState.module.css';

export default function EmptyState({ title = 'No projects found', sub = 'Try a different search or filter' }) {
  return (
    <div className={styles.empty}>
      <div className={styles.icon}>◫</div>
      <div className={styles.title}>{title}</div>
      <div className={styles.sub}>{sub}</div>
    </div>
  );
}
