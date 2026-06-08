import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './JobDetails.module.css';

const BASE_URL = 'https://9126c98e-e2e1-4608-8843-5de80d6148b8-00-12rx1cwtt852y.spock.replit.dev/api';

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('ct_token')}`,
});

const getMyApplications = () =>
  axios.get(`${BASE_URL}/jobs/my-applications`, { headers: authHeaders() });

const applyToJob = (id) =>
  axios.post(`${BASE_URL}/jobs/${id}/apply`, {}, { headers: authHeaders() });

const statusStyle = {
  Pending:  { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)'  },
  Accepted: { color: '#22C55E', bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.3)'   },
  Rejected: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)'   },
};

const getInitial = (company) => (company ? company.charAt(0).toUpperCase() : '?');

export default function JobDetails({ job }) {
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    setAppsLoading(true);
    getMyApplications()
      .then((res) => setApplications(res.data))
      .catch(() => setApplications([]))
      .finally(() => setAppsLoading(false));
  }, []);

  const handleApply = () => {
    if (!job) return;
    setApplying(true);
    setApplyError(null);
    applyToJob(job.id)
      .then(() => setApplied(true))
      .catch((err) => {
        const msg = err.response?.data?.message || 'Could not apply. Please log in.';
        setApplyError(msg);
      })
      .finally(() => setApplying(false));
  };

  if (!job) return null;

  const logoContent = job.logo_url ? (
    <img src={job.logo_url} alt={job.company} style={{ width: 28, height: 28, objectFit: 'contain' }} />
  ) : (
    <span className={styles.logo}>{getInitial(job.company)}</span>
  );

  return (
    <div className={styles.sidebar}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoWrap}>{logoContent}</div>
          <div>
            <h2 className={styles.title}>{job.title}</h2>
            <p className={styles.sub}>{job.company} · {job.location}</p>
          </div>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            {job.salary}
          </span>
          <span className={styles.infoItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {job.location}
          </span>
          <span className={styles.infoItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            {job.job_type}
          </span>
        </div>

        {(job.skills || []).length > 0 && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>REQUIRED SKILLS</h4>
            <div className={styles.skills}>
              {job.skills.map((s) => (
                <span key={s} className={styles.skillTag}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {job.description && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>ABOUT THE ROLE</h4>
            <p className={styles.about}>{job.description}</p>
          </div>
        )}

        {applyError && (
          <p style={{ color: '#EF4444', fontSize: '0.8rem', marginBottom: 8 }}>{applyError}</p>
        )}

        <button
          className={styles.applyBtn}
          onClick={handleApply}
          disabled={applying || applied}
        >
          {applied ? 'Applied ✓' : applying ? 'Applying...' : 'Apply Now'}
        </button>
      </div>

      <div className={styles.card}>
        <h3 className={styles.appsTitle}>My Applications</h3>
        <div className={styles.appsList}>
          {appsLoading && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '12px 0' }}>Loading...</p>
          )}
          {!appsLoading && applications.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '12px 0' }}>No applications yet.</p>
          )}
          {!appsLoading && applications.map((app) => {
            const st = statusStyle[app.status] || statusStyle['Pending'];
            return (
              <div key={app.id} className={styles.appItem}>
                <div className={styles.appLogo}>
                  {app.logo_url
                    ? <img src={app.logo_url} alt={app.company} style={{ width: 20, height: 20 }} />
                    : getInitial(app.company)}
                </div>
                <div className={styles.appMeta}>
                  <span className={styles.appTitle}>{app.title}</span>
                  <span className={styles.appSub}>{app.company}</span>
                </div>
                <span
                  className={styles.statusBadge}
                  style={{ color: st.color, background: st.bg, borderColor: st.border }}
                >
                  {app.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
