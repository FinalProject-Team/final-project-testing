import { useState, useEffect } from 'react';
import styles from './JobDetails.module.css';

import {
  apiApplyToJob,
  apiGetMyApplications
} from '../../../services/api/api';


const statusStyle = {
  Pending: {
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.3)'
  },
  Accepted: {
    color: '#22C55E',
    bg: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.3)'
  },
  Rejected: {
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.3)'
  }
};

const getInitial = (company) =>
  company ? company.charAt(0).toUpperCase() : '?';

export default function JobDetails({ job }) {
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(true);

  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState(null);
  const [applied, setApplied] = useState(false);

  /* ───────────────── GET MY APPLICATIONS ───────────────── */
  useEffect(() => {
    setAppsLoading(true);

    apiGetMyApplications()
      .then((res) => setApplications(res.data || []))
      .catch(() => setApplications([]))
      .finally(() => setAppsLoading(false));
  }, []);

  /* ───────────────── APPLY TO JOB ───────────────── */
  const handleApply = () => {
    if (!job) return;

    setApplying(true);
    setApplyError(null);

    apiApplyToJob(job.id)
      .then(() => setApplied(true))
      .catch((err) => {
        const msg =
          err.response?.data?.message ||
          'Could not apply. Please log in.';
        setApplyError(msg);
      })
      .finally(() => setApplying(false));
  };

  if (!job) return null;

  const logoContent = job.logo_url ? (
    <img
      src={job.logo_url}
      alt={job.company}
      style={{ width: 28, height: 28, objectFit: 'contain' }}
    />
  ) : (
    <span className={styles.logo}>{getInitial(job.company)}</span>
  );

  const alreadyApplied = applications.some(
    (app) => app.job_id === job.id
  );

  return (
    <div className={styles.sidebar}>
      {/* ───────── JOB CARD ───────── */}
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoWrap}>{logoContent}</div>

          <div>
            <h2 className={styles.title}>{job.title}</h2>
            <p className={styles.sub}>
              {job.company} · {job.location}
            </p>
          </div>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoItem}>{job.salary}</span>
          <span className={styles.infoItem}>{job.location}</span>
          <span className={styles.infoItem}>{job.job_type}</span>
        </div>

        {/* Skills */}
        {(job.skills || []).length > 0 && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>REQUIRED SKILLS</h4>
            <div className={styles.skills}>
              {job.skills.map((s) => (
                <span key={s} className={styles.skillTag}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {job.description && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>ABOUT THE ROLE</h4>
            <p className={styles.about}>{job.description}</p>
          </div>
        )}

        {/* Error */}
        {applyError && (
          <p style={{ color: '#EF4444', fontSize: '0.8rem' }}>
            {applyError}
          </p>
        )}

        {/* APPLY BUTTON */}
        <button
          className={styles.applyBtn}
          onClick={handleApply}
          disabled={applying || applied || alreadyApplied}
        >
          {alreadyApplied
            ? 'Already Applied'
            : applied
              ? 'Applied ✓'
              : applying
                ? 'Applying...'
                : 'Apply Now'}
        </button>
      </div>

      {/* ───────── MY APPLICATIONS ───────── */}
      <div className={styles.card}>
        <h3 className={styles.appsTitle}>My Applications</h3>

        <div className={styles.appsList}>
          {appsLoading && (
            <p style={{ fontSize: '0.85rem', color: '#aaa' }}>
              Loading...
            </p>
          )}

          {!appsLoading && applications.length === 0 && (
            <p style={{ fontSize: '0.85rem', color: '#aaa' }}>
              No applications yet.
            </p>
          )}

          {!appsLoading &&
            applications.map((app) => {
              const st =
                statusStyle[app.status] || statusStyle.Pending;

              return (
                <div key={app.id} className={styles.appItem}>
                  <div className={styles.appMeta}>
                    <span className={styles.appTitle}>
                      {app.title}
                    </span>
                    <span className={styles.appSub}>
                      {app.company}
                    </span>
                  </div>

                  <span
                    className={styles.statusBadge}
                    style={{
                      color: st.color,
                      background: st.bg,
                      borderColor: st.border
                    }}
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