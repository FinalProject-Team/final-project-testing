import { useEffect, useState } from 'react';
import { apiGetMe, apiGetMyApplications } from '../../services/api/api';
import styles from './NormalUserDashboard.module.css';

export default function NormalUserDashboard() {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const me = await apiGetMe();
        const apps = await apiGetMyApplications();
        if (!mounted) return;
        setProfile(me?.profile || me?.user || me || null);
        // apps may be array of applications; ensure array
        setApplications(Array.isArray(apps) ? apps : (apps?.data || apps?.applications || []));
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  const accepted = applications.filter(a => {
    const st = (a.status || a.application_status || '').toString().toLowerCase();
    return ['accepted', 'hired', 'approved'].includes(st);
  });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.title}>My Dashboard</h2>

        {loading ? (
          <div>Loading…</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3>Profile</h3>
              <p><strong>Name:</strong> {profile?.full_name || profile?.name || '—'}</p>
              <p><strong>Email:</strong> {profile?.email || profile?.user?.email || '—'}</p>
            </div>

            <div className={styles.card}>
              <h3>Applications</h3>
              {applications.length === 0 ? (
                <div>No applications yet</div>
              ) : (
                <ul className={styles.list}>
                  {applications.map(app => (
                    <li key={app.id || app.application_id}>
                      <div className={styles.jobTitle}>{app.job?.title || app.position || app.job_title || 'Job'}</div>
                      <div className={styles.jobMeta}>Status: {app.status || app.application_status || '—'}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.card}>
              <h3>Accepted / Hired</h3>
              {accepted.length === 0 ? (
                <div>No accepted applications yet</div>
              ) : (
                <ul className={styles.list}>
                  {accepted.map(app => (
                    <li key={app.id || app.application_id}>
                      <div className={styles.jobTitle}>{app.job?.title || app.position || app.job_title || 'Job'}</div>
                      <div className={styles.jobMeta}>Accepted on: {app.updated_at || app.accepted_at || '—'}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
