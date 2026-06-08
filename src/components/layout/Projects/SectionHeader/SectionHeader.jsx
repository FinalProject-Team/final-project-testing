import styles from './SectionHeader.module.css';

const SECTION_STYLES = {
  completed:   { icon:'✓', color:'#10B981', bg:'rgba(16,185,129,0.12)',  badgeBg:'rgba(16,185,129,0.14)'  },
  in_progress: { icon:'◐', color:'#F59E0B', bg:'rgba(245,158,11,0.12)', badgeBg:'rgba(245,158,11,0.14)'  },
  planned:     { icon:'○', color:'#A855F7', bg:'rgba(168,85,247,0.12)', badgeBg:'rgba(168,85,247,0.14)'  },
};

export default function SectionHeader({ type, title, count }) {
  const cfg = SECTION_STYLES[type] || SECTION_STYLES.planned;
  return (
    <div className={styles.header}>
      <div className={styles.iconWrap} style={{ background: cfg.bg, color: cfg.color }}>
        {cfg.icon}
      </div>
      <span className={styles.title}>{title}</span>
      <span className={styles.badge} style={{ background: cfg.badgeBg, color: cfg.color }}>
        {count}
      </span>
      <div className={styles.spacer} />
      <span className={styles.meta}>{count} project{count !== 1 ? 's' : ''}</span>
    </div>
  );
}
