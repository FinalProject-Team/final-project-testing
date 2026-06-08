import styles from './StatusBadge.module.css';
import { STATUS_CONFIG } from '../../../../utils/constants';

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <span
      className={styles.badge}
      style={{
        color: config.color,
        background: config.bg,
        borderColor: config.border,
      }}
    >
      <span
        className={`${styles.dot} ${status !== 'completed' ? styles.dotPulse : ''}`}
        style={{ background: config.dot, boxShadow: `0 0 6px ${config.dot}` }}
      />
      {config.label}
    </span>
  );
}
