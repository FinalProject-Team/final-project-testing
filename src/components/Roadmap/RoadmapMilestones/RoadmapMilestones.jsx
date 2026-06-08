import { Code2, Zap, Star, Lock } from 'lucide-react';
import { milestones as FALLBACK } from './milestonesData.js';
import styles from './RoadmapMilestones.module.css';

const iconMap = { code: Code2, zap: Zap, star: Star, lock: Lock };
const COLORS  = ['cyan', 'purple', 'orange', 'cyan', 'purple'];

function normalizeApiMilestone(m, i) {
  return {
    id:     m.id     || i,
    icon:   m.icon   || 'star',
    title:  m.title  || m.name || `Milestone ${i + 1}`,
    status: m.status === 'completed' || m.achieved ? 'achieved' : 'locked',
    color:  m.color  || COLORS[i % COLORS.length],
  };
}

export default function RoadmapMilestones({ apiProgress }) {
  const raw = apiProgress?.milestones || (Array.isArray(apiProgress) ? apiProgress : null);
  const milestones = raw ? raw.map(normalizeApiMilestone) : FALLBACK;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Milestones</h2>
      <div className={styles.grid}>
        {milestones.map((m, i) => {
          const Icon = iconMap[m.icon] || Star;
          return (
            <div key={m.id} className={`${styles.card} ${styles[m.color + 'Card']}`} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className={`${styles.iconWrap} ${styles[m.color + 'Icon']}`}><Icon size={22} /></div>
              <div className={styles.cardTitle}>{m.title}</div>
              <div className={`${styles.status} ${styles[m.status]}`}>
                {m.status === 'achieved' ? 'Achieved' : 'Locked'}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
