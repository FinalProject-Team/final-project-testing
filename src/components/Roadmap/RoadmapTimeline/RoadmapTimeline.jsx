import { Check, Zap, Lock, ChevronRight, Star } from 'lucide-react';
import { roadmapSteps as FALLBACK_STEPS } from './roadmapData.js';
import styles from './RoadmapTimeline.module.css';

function normalizeApiStep(s, idx) {
  return {
    id:     s.id    || idx,
    title:  s.title || s.name || `Step ${idx + 1}`,
    status: s.status === 'completed' ? 'complete' : s.status === 'current' ? 'in-progress' : (s.status || 'locked'),
    xp:     s.xp    || s.xp_reward || 0,
    skills: Array.isArray(s.skills) ? s.skills : (s.topics ? s.topics.map(t => t.title || t) : []),
  };
}

function StepIcon({ status }) {
  if (status === 'complete')     return <Check size={14} strokeWidth={2.5} />;
  if (status === 'in-progress')  return <Zap   size={14} strokeWidth={2} />;
  return <Lock size={13} strokeWidth={2} />;
}

function RoadmapStep({ step, index, total }) {
  return (
    <div className={styles.stepRow} style={{ animationDelay: `${index * 0.08}s` }}>
      <div className={styles.dotCol}>
        <div className={`${styles.dot} ${styles[step.status]}`}>
          <StepIcon status={step.status} />
        </div>
        {index < total - 1 && <div className={styles.line} />}
      </div>

      <div className={`${styles.card} ${styles[step.status + 'Card']}`}>
        <div className={styles.cardLeft}>
          <div className={styles.titleRow}>
            <span className={styles.stepTitle}>{step.title}</span>
            <span className={`${styles.badge} ${styles[step.status + 'Badge']}`}>
              {step.status === 'complete'    && 'Complete'}
              {step.status === 'in-progress' && 'In Progress'}
              {step.status === 'locked'      && 'Locked'}
            </span>
          </div>
          <div className={styles.skills}>
            {(step.skills || []).map(skill => (
              <span key={skill} className={`${styles.skill} ${step.status === 'locked' ? styles.skillLocked : ''}`}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.cardRight}>
          <div className={`${styles.xp} ${step.status === 'locked' ? styles.xpLocked : ''}`}>
            <Star size={14} className={styles.star} />
            {(step.xp || 0).toLocaleString()} XP
          </div>
          {step.status === 'in-progress' && (
            <button className={styles.continueBtn}>Continue <ChevronRight size={13} /></button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RoadmapTimeline({ apiRoadmap }) {
  const rawSteps = apiRoadmap?.steps || apiRoadmap?.roadmap || (Array.isArray(apiRoadmap) ? apiRoadmap : null);
  const steps    = rawSteps ? rawSteps.map(normalizeApiStep) : FALLBACK_STEPS;

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Learning Roadmap</h2>
        <div className={styles.trackBadge}>{apiRoadmap?.track || 'Frontend Development'}</div>
      </div>
      <div className={styles.steps}>
        {steps.map((step, i) => <RoadmapStep key={step.id} step={step} index={i} total={steps.length} />)}
      </div>
    </section>
  );
}
