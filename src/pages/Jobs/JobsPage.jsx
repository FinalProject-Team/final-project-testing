import { useState, useRef, useEffect } from 'react';
import { BsBriefcaseFill } from 'react-icons/bs';
import { useAuth } from '../../context/AuthContext';
import { apiGetAllJobs, apiApplyToJob, apiGetMyApplications } from '../../services/api/api';
import styles from './JobsPage.module.css';

import StatsCards from '../../components/Jobs/StatsCards/StatsCards';
import SearchBar from '../../components/Jobs/SearchBar/SearchBar';
import JobCard from '../../components/Jobs/JobCard/JobCard';
import JobDetails from '../../components/Jobs/JobDetails/JobDetails';
import JobPostModal from "../../pages/Jobs/JobPostModal.jsx";
export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState({ job_type: '', location: '' });
  const [myApps, setMyApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('browse'); // 'browse' | 'applied'
  const [search, setSearch] = useState('');
  const sidebarRef = useRef(null);


  const [selectedJob, setSelectedJob] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);


  const { isAuthenticated, isJobSeeker } = useAuth();
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    (async () => {
      try {
        const [jobsRes, appsRes] = await Promise.allSettled([
          apiGetAllJobs(),
          isAuthenticated && !isJobSeeker ? apiGetMyApplications() : Promise.resolve([]),
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

  const handleApply = async (jobId) => {
    if (!isAuthenticated) { alert('Please log in to apply.'); return; }
    setApplying(jobId);
    try {
      await apiApplyToJob(jobId);
      if (mounted.current) {
        setMyApps(prev => [...prev, { job_id: jobId }]);
        alert('Application submitted!');
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to apply.');
    } finally {
      if (mounted.current) setApplying(null);
    }
  };

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
    <div className={styles.page}>
      <StatsCards />

      <div className={styles.headerActions}>
        <button
          className={styles.postBtn}
          onClick={() => setShowPostModal(true)}
        >
          Post Job
        </button>
      </div>

      <div className={styles.body}>
        <div className={styles.left}>
          <SearchBar
            value={search}
            onChange={setSearch}
            onFilterClick={() => setFiltersVisible(v => !v)}
          />

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
        onClose={() =>
          setShowPostModal(false)
        }
      />
    </div>

  );
}