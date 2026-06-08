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
    const load = async () => {
      try {
        setLoading(true);

        const projects = await projectsService.getAll();
        setAllProjects(projects);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // =======================
  // 2. FILTERED PROJECTS
  // =======================
  const filteredProjects = useMemo(() => {
    let projects = allProjects;

    const q = searchQuery.trim().toLowerCase();

    if (q) {
      projects = projects.filter(p =>
        p.title?.toLowerCase().includes(q)
      );
    }

    if (activeFilter !== 'all') {
      projects = projects.filter(
        p => normalizeStatus(p.status) === activeFilter
      );
    }

    return projects;
  }, [allProjects, searchQuery, activeFilter]);

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