import { useState, useEffect, useRef } from 'react';
import styles from './JobDetails.module.css';
import {
  apiApplyToJob,
  apiGetMyApplications,
  apiGetJobApplicants,
  apiUpdateApplicationStatus
} from '../../../services/api/api';

const statusStyle = {
  pending: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  accepted: { color: '#22C55E', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)' },
  rejected: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
};

const getInitial = (company) => (company ? company.charAt(0).toUpperCase() : '?');

export default function JobDetails({ job, user }) {
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(true);

  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  const submittingRef = useRef(false);

  // ───────────────── MY APPLICATIONS (student) ─────────────────
  useEffect(() => {
    if (!job) return;

    let isMounted = true;

    const fetchApplications = async () => {
      try {
        setAppsLoading(true);
        const data = await apiGetMyApplications();
        if (isMounted) setApplications(Array.isArray(data) ? data : []);
      } catch {
        if (isMounted) setApplications([]);
      } finally {
        if (isMounted) setAppsLoading(false);
      }
    };

    fetchApplications();

    return () => {
      isMounted = false;
    };
  }, [job]);

  // ───────────────── APPLICANTS (owner only) ─────────────────
  useEffect(() => {
    if (!job || !user) return;

    const isOwner = job.posted_by === user.id;
    if (!isOwner) return;

    const fetchApplicants = async () => {
      try {
        setLoadingApplicants(true);
        const data = await apiGetJobApplicants(job.id);
        setApplicants(Array.isArray(data) ? data : []);
      } catch {
        setApplicants([]);
      } finally {
        setLoadingApplicants(false);
      }
    };

    fetchApplicants();
  }, [job, user]);

  // ───────────────── APPLY CHECK ─────────────────
  const alreadyApplied = applications.some(
    (app) => app.job_id === job?.id
  );

  const canApply = !appsLoading && !alreadyApplied && !applying;

  const handleApply = () => {
    if (!canApply) return;
    setApplyError(null);
    setShowApplyModal(true);
  };

  const submitApplication = async () => {
    if (submittingRef.current || !canApply) return;

    if (!coverLetter.trim()) {
      setApplyError('Cover letter required');
      return;
    }

    submittingRef.current = true;
    setApplying(true);

    try {
      await apiApplyToJob(job.id, coverLetter);

      setShowApplyModal(false);
      setCoverLetter('');

      const refreshed = await apiGetMyApplications();
      setApplications(Array.isArray(refreshed) ? refreshed : []);

    } catch (err) {
      setApplyError(err.response?.data?.message || 'Error applying');
    } finally {
      submittingRef.current = false;
      setApplying(false);
    }
  };

  // ───────────────── ACCEPT / REJECT ─────────────────
  const updateStatus = async (applicationId, status) => {
    try {
      await apiUpdateApplicationStatus(applicationId, status);

      const refreshed = await apiGetJobApplicants(job.id);
      setApplicants(Array.isArray(refreshed) ? refreshed : []);
    } catch (err) {
      console.error(err);
    }
  };

  if (!job) return null;

  const isOwner = job.posted_by === user?.id;

  return (
    <div className={styles.sidebar}>

      {/* ───────────────── JOB INFO ───────────────── */}
      <div className={styles.card}>
        <h2 className={styles.title}>{job.title}</h2>
        <p className={styles.sub}>{job.company} · {job.location}</p>

        <div className={styles.infoRow}>
          <span>{job.salary}</span>
          <span>{job.job_type}</span>
        </div>

        {job.description && (
          <p className={styles.about}>{job.description}</p>
        )}

        {!isOwner && (
          <>
            {alreadyApplied ? (
              <div className={styles.appliedBox}>
                You already applied
              </div>
            ) : (
              <button onClick={handleApply} disabled={!canApply}>
                Apply Now
              </button>
            )}
          </>
        )}
      </div>

      {/* ───────────────── MY APPLICATIONS ───────────────── */}
      {!isOwner && (
        <div className={styles.card}>
          <h3>My Applications</h3>

          {appsLoading && <p>Loading...</p>}

          {!appsLoading && applications.length === 0 && (
            <p>No applications yet</p>
          )}

          {applications.map((app) => {
            const st = statusStyle[app.status] || statusStyle.pending;

            return (
              <div key={app.id} className={styles.appItem}>
                <div>
                  <strong>{app.job?.title}</strong>
                  <p>{app.job?.company}</p>
                </div>

                <span style={{
                  color: st.color,
                  background: st.bg,
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}>
                  {app.status}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* ───────────────── APPLICANTS (OWNER ONLY) ───────────────── */}
      {isOwner && (
        <div className={styles.card}>
          <h3>Applicants</h3>

          {loadingApplicants && <p>Loading...</p>}

          {!loadingApplicants && applicants.length === 0 && (
            <p>No applicants yet</p>
          )}

          {applicants.map((app) => (
            <div key={app.id} className={styles.appItem}>

              <div>
                <strong>{app.user?.full_name}</strong>
                <p>{app.user?.email}</p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => updateStatus(app.id, 'accepted')}>
                  Accept
                </button>

                <button onClick={() => updateStatus(app.id, 'rejected')}>
                  Reject
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ───────────────── APPLY MODAL ───────────────── */}
      {showApplyModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Apply</h3>

            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write your cover letter..."
            />

            {applyError && <p>{applyError}</p>}

            <button onClick={() => setShowApplyModal(false)}>
              Cancel
            </button>

            <button onClick={submitApplication}>
              Submit
            </button>
          </div>
        </div>
      )}

    </div>
  );
}