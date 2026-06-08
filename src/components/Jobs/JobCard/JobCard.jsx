import styles from './JobCard.module.css';

const matchColor = (pct) => {
  if (pct >= 90) return '#22C55E';
  if (pct >= 80) return '#0EA5E9';
  if (pct >= 70) return '#A855F7';
  return '#F59E0B';
};

// API doesn't return logo/logoColor – use company initial as fallback
const getInitial = (company) => (company ? company.charAt(0).toUpperCase() : '?');

export default function JobCard({ job, selected, onClick }) {
  const logoContent = job.logo_url ? (
    <img src={job.logo_url} alt={job.company} style={{ width: 24, height: 24, objectFit: 'contain' }} />
  ) : (
    <span className={styles.logo}>{getInitial(job.company)}</span>
  );

  // Format created_at as relative time
  const posted = job.created_at
    ? new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '';

  return (
    <div
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      onClick={() => onClick(job)}
    >
      <div className={styles.header}>
        <div className={styles.logoWrap} style={{ background: 'rgba(14,165,233,0.1)' }}>
          {logoContent}
        </div>
        <div className={styles.meta}>
          <span className={styles.title}>{job.title}</span>
          <span className={styles.company}>
            {job.company} {posted && `· ${posted}`}
          </span>
        </div>
        {job.match_rate != null && (
          <span
            className={styles.badge}
            style={{
              color: matchColor(job.match_rate),
              borderColor: `${matchColor(job.match_rate)}40`,
              background: `${matchColor(job.match_rate)}12`,
            }}
          >
            {job.match_rate}% match
          </span>
        )}
      </div>

      <div className={styles.details}>
        <span className={styles.detail}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          {job.salary}
        </span>
        <span className={styles.detail}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {job.location}
        </span>
        <span className={styles.detail}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {job.job_type}
        </span>
      </div>

      <div className={styles.tags}>
        {(job.skills || []).map((s) => (
          <span key={s} className={styles.tag}>{s}</span>
        ))}
      </div>
    </div>
  );
}
