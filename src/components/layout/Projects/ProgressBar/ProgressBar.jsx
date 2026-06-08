import styles from './ProgressBar.module.css';
import { PROGRESS_COLORS } from '../../../../utils/constants';

export default function ProgressBar({ progress, status, animated = true }) {
  const gradient = PROGRESS_COLORS[status] || 'linear-gradient(90deg, #0EA5E9, #22D3EE)';

  return (
    <div className={styles.wrapper}>
      <div className={styles.labelRow}>
        <span className={styles.label}>Project Progress</span>
        <span className={styles.percent} style={{ color: progress === 100 ? '#10B981' : '#0EA5E9' }}>
          {progress}%
        </span>
      </div>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{
            background: gradient,
            '--target-width': `${progress}%`,
            width: animated ? undefined : `${progress}%`,
            boxShadow: `0 0 10px rgba(14, 165, 233, 0.4)`,
          }}
        />
      </div>
    </div>
  );
}