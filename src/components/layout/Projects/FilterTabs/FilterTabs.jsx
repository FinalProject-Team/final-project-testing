import styles from './FilterTabs.module.css';
import { FILTER_TABS } from '../../../../utils/constants';

export default function FilterTabs({ active, onChange, stats }) {
  const getCounts = (id) => {
    if (!stats) return null;
    const map = { all: stats.total, completed: stats.completed, in_progress: stats.inProgress, planned: stats.planned };
    return map[id] ?? null;
  };

  return (
    <div className={styles.tabs}>
      {FILTER_TABS.map(tab => (
        <button
          key={tab.id}
          className={`${styles.tab} ${active === tab.id ? styles.active : ''}`}
          onClick={() => onChange(tab.id)}
        >
          <span className={styles.tabIcon}>{tab.icon}</span>
          {tab.label}
          {getCounts(tab.id) !== null && (
            <span className={styles.count}>{getCounts(tab.id)}</span>
          )}
        </button>
      ))}
    </div>
  );
}
