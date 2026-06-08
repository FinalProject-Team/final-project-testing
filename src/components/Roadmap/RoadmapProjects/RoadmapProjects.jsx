import { Code2, Zap } from 'lucide-react';
import { projects as FALLBACK_PROJECTS, tips } from './projectsData.js';
import styles from './RoadmapProjects.module.css';

function levelColor(level) {
  if (level === 'Beginner')     return 'beginner';
  if (level === 'Intermediate') return 'intermediate';
  return 'advanced';
}

function normalizeApiProject(p) {
  return {
    id:    p.id,
    title: p.title,
    xp:    p.xp_reward || p.stars || 0,
    level: p.category  || 'Beginner',
    tags:  Array.isArray(p.technologies) ? p.technologies.slice(0, 3) : [],
  };
}

export default function RoadmapProjects({ apiProjects }) {
  const projects = (apiProjects && apiProjects.length > 0)
    ? apiProjects.map(normalizeApiProject)
    : FALLBACK_PROJECTS;

  return (
    <div className={styles.grid}>
      <section className={styles.col}>
        <h2 className={styles.colTitle}>Recommended Projects</h2>
        <div className={styles.projectList}>
          {projects.map((p, i) => (
            <div key={p.id} className={styles.projectCard} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={styles.projectIcon}><Code2 size={16} /></div>
              <div className={styles.projectInfo}>
                <div className={styles.projectTitle}>{p.title}</div>
                <div className={styles.projectTags}>
                  {(p.tags || []).map(t => <span key={t} className={styles.tag}>{t}</span>)}
                </div>
              </div>
              <div className={styles.projectMeta}>
                <div className={styles.projectXp}>+{p.xp} XP</div>
                <div className={`${styles.projectLevel} ${styles[levelColor(p.level)]}`}>{p.level}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.col}>
        <h2 className={styles.colTitle}>AI Smart Tips</h2>
        <div className={styles.tipsList}>
          {tips.map((tip, i) => (
            <div key={tip.id} className={`${styles.tipCard} ${styles[tip.color + 'Tip']}`} style={{ animationDelay: `${i * 0.1}s` }}>
              <Zap size={14} className={`${styles.tipIcon} ${styles[tip.color + 'Icon']}`} />
              <p className={styles.tipText}>{tip.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
