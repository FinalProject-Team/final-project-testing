import { useState, useRef, useEffect } from 'react';
import { BsBriefcaseFill } from 'react-icons/bs';
import { useAuth } from '../../context/AuthContext';
import { apiGetAllJobs, apiApplyToJob, apiGetMyApplications } from '../../services/api/api';
import styles from './JobsPage.module.css';

import StatsCards from '../../components/Jobs/StatsCards/StatsCards';
import SearchBar from '../../components/Jobs/SearchBar/SearchBar';
import JobCard from '../../components/Jobs/JobCard/JobCard';
import JobDetails from '../../components/Jobs/JobDetails/JobDetails';

export default function JobsPage() {
  const [jobs, setJobs]               = useState([]);
  const [myApps, setMyApps]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [applying, setApplying]       = useState(null);
  const [error, setError]             = useState(null);
  const [tab, setTab]                 = useState('browse'); // 'browse' | 'applied'
  const [search, setSearch]           = useState('');
  const sidebarRef = useRef(null);
  const [selectedJob, setSelectedJob] = useState(null);




  const { isAuthenticated, isJobSeeker } = useAuth();
  const mounted                        = useRef(true);

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
  const handleSelectJob = (job) => {
  setSelectedJob(job);
};

  return (
       <div className={styles.page}>
      <StatsCards />
      <div className={styles.body}>
        <div className={styles.left}>
          <SearchBar value={search} onChange={setSearch} />
          <div className={styles.jobList}>
            {loading && <div className={styles.empty}>Loading jobs...</div>}
            {!loading && error && (
              <div className={styles.empty} style={{ color: '#EF4444' }}>{error}</div>
            )}
            {!loading && !error && filtered.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                selected={selectedJob?.id === job.id}
              onClick={() => handleSelectJob(job)}
              />
            ))}
            {!loading && !error && filtered.length === 0 && (
              <div className={styles.empty}>No jobs match your search.</div>
            )}
          </div>
        </div>
        <div className={styles.right} ref={sidebarRef}>
          <JobDetails job={selectedJob} />
        </div>
      </div>
    </div>
  );
}
