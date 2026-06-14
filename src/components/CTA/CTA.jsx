import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import styles from './CTA.module.css';

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section id="coursesCTA" className={styles.cta}>
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
          <button type="button" className={styles.primaryBtn} onClick={() => navigate('/register')}>
            <span>✦</span> Get Started  <ArrowRight size={18} />
          </button>
          
        </div>
      </div>
    </section>
  );
}
