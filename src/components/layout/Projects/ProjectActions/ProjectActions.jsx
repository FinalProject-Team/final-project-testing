import styles from './ProjectActions.module.css';

export default function ProjectActions({ githubUrl, liveUrl }) {
  return (
    <div className={styles.actions}>
      {/* <a
        href={liveUrl || '#'}
        target={liveUrl ? '_blank' : undefined}
        rel="noopener noreferrer"
        className={`${styles.btnPrimary} ${!liveUrl ? styles.disabled : ''}`}
        onClick={e => !liveUrl && e.preventDefault()}
      >
        <span>⊙</span>
        View Project
      </a> */}
      <a
        href={githubUrl || '#'}
        target={githubUrl ? '_blank' : undefined}
        rel="noopener noreferrer"
        className={`${styles.btnIcon} ${styles.github} ${!githubUrl ? styles.disabled : ''}`}
        title="GitHub"
        onClick={e => !githubUrl && e.preventDefault()}
      >
        ⎇
      </a>
      <a
        href={liveUrl || '#'}
        target={liveUrl ? '_blank' : undefined}
        rel="noopener noreferrer"
        className={`${styles.btnIcon} ${!liveUrl ? styles.disabled : ''}`}
        title="Live Demo"
        onClick={e => !liveUrl && e.preventDefault()}
      >
        ↗
      </a>
    </div>
  );
}
