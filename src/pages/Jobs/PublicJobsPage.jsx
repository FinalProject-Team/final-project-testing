import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiGetAllJobs, apiGetMyApplications } from '../../services/api/api';
import styles from './JobsPage.module.css';
import Topbar from '../../components/layout/Topbar/Topbar';
import StatsCards from '../../components/Jobs/StatsCards/StatsCards';
import JobCard from '../../components/Jobs/JobCard/JobCard';
import JobDetails from '../../components/Jobs/JobDetails/JobDetails';
import JobPostModal from './JobPostModal.jsx';

export default function PublicJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [myApps, setMyApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const sidebarRef = useRef(null);

  const [selectedJob, setSelectedJob] = useState(null);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState({ job_type: '', location: '' });

  const { isAuthenticated, canPostJobs } = useAuth();
  const [showPostModal, setShowPostModal] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    (async () => {
      try {
        const [jobsRes, appsRes] = await Promise.allSettled([
          apiGetAllJobs(),
          isAuthenticated ? apiGetMyApplications() : Promise.resolve([]),
        ]);
        if (!mounted.current) return;
        if (jobsRes.status === 'fulfilled') {
          const list = Array.isArray(jobsRes.value) ? jobsRes.value : jobsRes.value?.jobs ?? [];
          setJobs(list);
        }
        if (appsRes.status === 'fulfilled') {
          const list = Array.isArray(appsRes.value) ? appsRes.value : appsRes.value?.applications ?? [];
          setMyApps(list);
        }
      } catch (err) {
        if (mounted.current) setError(err?.response?.data?.message || 'Failed to load jobs.');
      } finally {
        if (mounted.current) setLoading(false);
      }
    })();
    return () => { mounted.current = false; };
  }, [isAuthenticated]);

  const appliedIds = new Set(myApps.map(a => String(a.job_id || a.id)));

  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    return (j.title || '').toLowerCase().includes(q) ||
      (j.company || '').toLowerCase().includes(q) ||
      (j.location || '').toLowerCase().includes(q);
  });

  const passesFilters = (j) => {
    if (filters.job_type && (j.job_type || '').toLowerCase() !== filters.job_type.toLowerCase()) return false;
    if (filters.location && !(j.location || '').toLowerCase().includes(filters.location.toLowerCase())) return false;
    return true;
  };

  const filteredWithFilters = filtered.filter(passesFilters);

  const handleSelectJob = (job) => {
    setSelectedJob(job);
  };

  return (
    <div>
      <div className={styles.page}>
        <Topbar
          title="Public Job Board"
          searchValue={search}
          onSearchChange={setSearch}
          metaLabel={`${jobs.length} jobs available`}
        />
        <StatsCards />

        {canPostJobs && (
          <div className={styles.headerActions}>
            <button
              className={styles.postBtn}
              type="button"
              onClick={() => setShowPostModal(true)}
            >
              Post Job
            </button>
          </div>
        )}

      <div className={styles.body}>
        <div className={styles.left}>
          <div className={styles.filterBar}>
            <button className={styles.filterToggle} onClick={() => setFiltersVisible(v => !v)}>
              Filter
            </button>
            <div className={styles.filterInfo}>Search is available in the top bar.</div>
          </div>

          {filtersVisible && (
            <div style={{ padding: 12, background: '#0b0f19', borderRadius: 8, marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <select value={filters.job_type} onChange={e => setFilters(f => ({ ...f, job_type: e.target.value }))}>
                  <option value="">All types</option>
                  {[...new Set(jobs.map(j => j.job_type).filter(Boolean))].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>

                <input placeholder="Location" value={filters.location} onChange={e => setFilters(f => ({ ...f, location: e.target.value }))} />

                <button onClick={() => setFilters({ job_type: '', location: '' })}>Clear</button>
              </div>
            </div>
          )}

          <div className={styles.jobList}>
            {loading && (
              <div className={styles.empty}>
                Loading jobs...
              </div>
            )}

            {!loading && error && (
              <div
                className={styles.empty}
                style={{ color: "hashtag#EF4444" }}
              >
                {error}
              </div>
            )}

            {!loading &&
              !error &&
              filteredWithFilters.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  selected={
                    selectedJob?.id === job.id
                  }
                  onClick={() =>
                    handleSelectJob(job)
                  }
                />
              ))}

            {!loading &&
              !error &&
              filtered.length === 0 && (
                <div className={styles.empty}>
                  No jobs match your search.
                </div>
              )}
          </div>
        </div>

        <div
          className={styles.right}
          ref={sidebarRef}
        >
          <JobDetails job={selectedJob} />
        </div>
      </div>

      <JobPostModal
        show={showPostModal}
        onClose={() => setShowPostModal(false)}
      />

      </div>

    </div>
  );
}
