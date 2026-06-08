import { ArrowRight } from 'lucide-react';
import styles from './CTA.module.css';

export default function CTA() {
  return (
    <section className={styles.cta}>
      <div className={styles.ctaContainer}>
        <div className={styles.badge}>Limited Spots Available</div>

        <h2 className={styles.title}>
          Start Your Career
          <br />
          <span className={styles.gradient}>Transformation Today</span>
        </h2>

        <p className={styles.description}>
          Join 50,000+ students who transformed their careers. AI assessment, personalized roadmap, and job placement — all in one platform.
        </p>

        <div className={styles.buttons}>
          <button className={styles.primaryBtn}>
            <span>✦</span> Get Started Free <ArrowRight size={18} />
          </button>
          <button className={styles.secondaryBtn}>
            Take Free Assessment
          </button>
        </div>
      </div>
    </section>
  );
}
