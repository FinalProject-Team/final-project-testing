import { useState, useEffect, useMemo, useCallback } from 'react';
import { projectsService } from '../services/api/projects.service';
import { PROJECT_STATUS } from '../data/projectsData';

const normalizeStatus = (status) =>
  status?.toLowerCase().replace(" ", "_");

export function useProjects() {
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // =======================
  // 1. API CALL
  // =======================
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          search: searchQuery?.trim() || undefined,
          status: activeFilter && activeFilter !== 'all' ? activeFilter : undefined,
        };

        const projects = await projectsService.getAll(params);
        console.debug('[useProjects] fetched projects count=', Array.isArray(projects) ? projects.length : (projects?.length || 0), 'params=', params);
        if (!mounted) return;
        setAllProjects(projects || []);

      } catch (err) {
        if (!mounted) return;
        setError(err?.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const timer = setTimeout(load, 300); // debounce rapid changes
    return () => { mounted = false; clearTimeout(timer); };
  }, [searchQuery, activeFilter]);

  // =======================
  // 2. SERVER-CONTROLLED PROJECTS
  // =======================
  // Server returns results according to `search` and `status` params.
  // We no longer apply client-side filtering — use the server-provided list.
  const filteredProjects = useMemo(() => allProjects, [allProjects]);

  // =======================
  // 3. STATS
  // =======================
  const stats = useMemo(() => ({
    total: filteredProjects.length,
    completed: filteredProjects.filter(
      p => normalizeStatus(p.status) === PROJECT_STATUS.COMPLETED
    ).length,
    inProgress: filteredProjects.filter(
      p => normalizeStatus(p.status) === PROJECT_STATUS.IN_PROGRESS
    ).length,
    planned: filteredProjects.filter(
      p => normalizeStatus(p.status) === PROJECT_STATUS.PLANNED
    ).length,
  }), [filteredProjects]);

  // =======================
  // 4. SPLIT PROJECTS
  // =======================
  const completed = useMemo(
    () => filteredProjects.filter(
      p => normalizeStatus(p.status) === PROJECT_STATUS.COMPLETED
    ),
    [filteredProjects]
  );

  const inProgress = useMemo(
    () => filteredProjects.filter(
      p => normalizeStatus(p.status) === PROJECT_STATUS.IN_PROGRESS
    ),
    [filteredProjects]
  );

  const planned = useMemo(
    () => filteredProjects.filter(
      p => normalizeStatus(p.status) === PROJECT_STATUS.PLANNED
    ),
    [filteredProjects]
  );

  // =======================
  // 5. HANDLERS
  // =======================
  const handleSearch = useCallback((q) => setSearchQuery(q), []);
  const handleFilter = useCallback((f) => setActiveFilter(f), []);

  // =======================
  // 6. RETURN
  // =======================
  return {
    loading,
    error,

    stats,

    completed,
    inProgress,
    planned,

    searchQuery,
    activeFilter,

    handleSearch,
    handleFilter,

    total: filteredProjects.length,
  };
}