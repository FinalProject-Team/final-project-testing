import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Background glow blobs */}
      <div className={styles.blobPurple}></div>
      <div className={styles.blobCyan}></div>

      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.badge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{marginRight: '7px', flexShrink: 0}}>
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" fill="#00d4ff"/>
            </svg>
            AI-Powered Career Development Platform
          </div>

          <h1 className={styles.heading}>
            Transform Your<br />
            <span className={styles.gradientText}>Skills </span>{' '} Into a Real
            <span className={styles.purpleText}> Career</span><br />
            
          </h1>

          <p className={styles.subheading}>
            CareerTech uses AI to create a personalized learning roadmap, match you with real jobs, and track your growth — from zero to hired.
          </p>

          <div className={styles.buttons}>
            <button className={styles.primaryBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" strokeLinejoin="round"/>
              </svg>
              Start Learning
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className={styles.secondaryBtn}>
              <svg width="13" height="15" viewBox="0 0 24 24" fill="none">
                <polygon points="5,3 19,12 5,21" fill="white"/>
              </svg>
              Explore Tracks
            </button>
          </div>

          <div className={styles.social}>
            <div className={styles.avatars}>
              {[1, 2, 3].map(i => (
                <div key={i} className={styles.avatar} style={{background: `hsl(${i * 60 + 180}, 60%, 50%)`}}></div>
              ))}
            </div>
            <div className={styles.rating}>
              <div className={styles.stars}>
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="15" height="15" viewBox="0 0 24 24" fill="#f59e0b">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/>
                  </svg>
                ))}
                <span className={styles.ratingNum}>4.9</span>
              </div>
              <span className={styles.ratingText}>Trusted by 50,000+ students</span>
            </div>
          </div>
        </div>

        <div className={styles.right}>
          {/* Orbital rings */}
          <div className={styles.orbitContainer}>
            <div className={styles.orbitRing1}></div>
            <div className={styles.orbitRing2}></div>
            <div className={styles.orbitCenter}>
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" fill="#00d4ff"/>
                <path d="M12 6l1.5 4.6H18l-3.9 2.8 1.5 4.6L12 15.3 8.4 18l1.5-4.6L6 10.6h4.5L12 6z" fill="white"/>
              </svg>
            </div>

            {/* Floating dots on orbit */}
            <div className={styles.orbitDot1}></div>
            <div className={styles.orbitDot2}></div>
            <div className={styles.orbitDot3}></div>

            {/* Floating cards */}
            <div className={styles.floatCard1}>
              <div className={styles.cardIconGreen}>↗</div>
              <div>
                <div className={styles.cardTitle}>XP +240</div>
                <div className={styles.cardSub}>Today's progress</div>
              </div>
            </div>

            <div className={styles.floatCard2}>
              <div className={styles.cardIconCyan}>🏛</div>
              <div>
                <div className={styles.cardTitle}>3 Job Matches</div>
                <div className={styles.cardSub}>High compatibility</div>
              </div>
            </div>

            <div className={styles.floatCard3}>
              <div className={styles.aiDot}></div>
              <span className={styles.cardTitle}>AI Assessment Active</span>
            </div>
          </div>

          {/* Purple glow under orbit */}
          <div className={styles.purpleGlow}></div>
        </div>
      </div>
    </section>
  );
}
