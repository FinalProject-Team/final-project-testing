import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.column}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>✦</div>
            <span>CareerTech</span>
          </div>
          <p className={styles.description}>
            AI-powered career development platform designed to transform your skills into real job opportunities.
          </p>
          <div className={styles.socials}>
            <a href="#" className={styles.social}>𝕏</a>
            <a href="#" className={styles.social}>In</a>
            <a href="#" className={styles.social}>Gh</a>
          </div>
        </div>

        <div className={styles.column}>
          <h4 className={styles.columnTitle}>Product</h4>
          <ul className={styles.links}>
            <li><a href="#tracks">Learning Tracks</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Enterprise</a></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4 className={styles.columnTitle}>Company</h4>
          <ul className={styles.links}>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Press</a></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4 className={styles.columnTitle}>Legal</h4>
          <ul className={styles.links}>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Terms</a></li>
            <li><a href="#">Cookies</a></li>
            <li><a href="#">License</a></li>
          </ul>
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.bottom}>
        <p className={styles.copyright}>© 2024 CareerTech. All rights reserved.</p>
        <p className={styles.credit}>Built by visionary engineers for the future of work.</p>
      </div>
    </footer>
  );
}
