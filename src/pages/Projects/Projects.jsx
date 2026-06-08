import { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import SearchBar from '../../components/layout/Projects/SearchBar/SearchBar';
import FilterTabs from '../../components/layout/Projects/FilterTabs/FilterTabs';
import LoadingSkeleton from '../../components/layout/Projects/LoadingSkeleton/LoadingSkeleton';
import CompletedProjects from './CompletedProjects';
import InProgressProjects from './InProgressProjects';
import PlannedProjects from './PlannedProjects';
import styles from './Projects.module.css';


const STAT_CONFIG = [
  {
    key: 'total',
    label: 'Total',
    icon: '◫',
    color: '#0EA5E9',
    iconBg: 'rgba(14,165,233,0.13)',
    barGrad: 'linear-gradient(90deg,#0EA5E9,#22D3EE)',
    badge: 'All',
    badgeColor: '#0EA5E9',
    badgeBg: 'rgba(14,165,233,0.1)',
    badgeBorder: 'rgba(14,165,233,0.22)',
  },
  {
    key: 'completed',
    label: 'Completed',
    icon: '✓',
    color: '#10B981',
    iconBg: 'rgba(16,185,129,0.13)',
    barGrad: 'linear-gradient(90deg,#10B981,#34D399)',
    badge: 'Done',
    badgeColor: '#10B981',
    badgeBg: 'rgba(16,185,129,0.1)',
    badgeBorder: 'rgba(16,185,129,0.22)',
  },
  {
    key: 'inProgress',
    label: 'In Progress',
    icon: '◐',
    color: '#F59E0B',
    iconBg: 'rgba(245,158,11,0.13)',
    barGrad: 'linear-gradient(90deg,#F59E0B,#FCD34D)',
    badge: 'WIP',
    badgeColor: '#F59E0B',
    badgeBg: 'rgba(245,158,11,0.1)',
    badgeBorder: 'rgba(245,158,11,0.22)',
  },
  {
    key: 'planned',
    label: 'Planned',
    icon: '○',
    color: '#A855F7',
    iconBg: 'rgba(168,85,247,0.13)',
    barGrad: 'linear-gradient(90deg,#A855F7,#C084FC)',
    badge: 'Soon',
    badgeColor: '#A855F7',
    badgeBg: 'rgba(168,85,247,0.1)',
    badgeBorder: 'rgba(168,85,247,0.22)',
  },
];

export default function Projects() {

  const {
    loading, error, stats,
    completed, inProgress, planned,
    searchQuery, activeFilter,
    handleSearch, handleFilter,
  } = useProjects();

  const hasResults = completed.length + inProgress.length + planned.length > 0;
  const totalCount = stats?.total || 0;

  return (
    <main className={styles.page}>
      <div className={styles.inner}>

        
        {/* ── Heading ──
        <div className={styles.pageHeading}>
          <div className={styles.breadcrumb}>
            <span>Home</span>
            <span>›</span>
            <span className={styles.crumbActive}>Projects</span>
          </div>
          <div className={styles.titleRow}>
            <div>
              <h1 className={styles.pageTitle}>Projects</h1>
              <p className={styles.pageSubtitle}>
                Build real-world experience with hands-on projects
              </p>
            </div>
          </div>
        </div> */}

        {/* ── Stats Grid ── */}
        {stats && (
          <div className={styles.statsGrid}>
            {STAT_CONFIG.map(cfg => {
              const val = stats[cfg.key] ?? 0;
              const pct = Math.round((val / totalCount) * 100);
              return (
                <div
                  key={cfg.key}
                  className={styles.statCard}
                  style={{ '--s-color': cfg.color }}
                >
                  <div className={styles.statTop}>
                    <div className={styles.statIcon}
                      style={{ background: cfg.iconBg, color: cfg.color }}>
                      {cfg.icon}
                    </div>
                    <span className={styles.statBadge}
                      style={{ color: cfg.badgeColor, background: cfg.badgeBg, borderColor: cfg.badgeBorder }}>
                      {cfg.badge}
                    </span>
                  </div>
                  <div className={styles.statNum} style={{ color: cfg.color }}>{val}</div>
                  <div className={styles.statLabel}>{cfg.label}</div>
                  <div className={styles.statBar}>
                    <div className={styles.statBarFill}
                      style={{ width: `${pct}%`, background: cfg.barGrad }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Controls ── */}
        <div className={styles.controlsBar}>
          <div className={styles.controlsLeft}>
            <SearchBar
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search projects, stack, category…"
            />
            <FilterTabs active={activeFilter} onChange={handleFilter} stats={stats} />
          </div>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <>
            <LoadingSkeleton count={3} />
            <LoadingSkeleton count={3} />
          </>
        ) : error ? (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>⚠</div>
            <div className={styles.noResultsTitle}>Something went wrong</div>
            <div className={styles.noResultsSub}>{error}</div>
          </div>
        ) : !hasResults ? (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>◫</div>
            <div className={styles.noResultsTitle}>No projects found</div>
            <div className={styles.noResultsSub}>
              {searchQuery ? `No results for "${searchQuery}"` : 'Try a different filter'}
            </div>
          </div>
        ) : (
          <>
            {(activeFilter === 'all' || activeFilter === 'completed') &&
  completed.length > 0 && (
    <CompletedProjects projects={completed} />
)}

{(activeFilter === 'all' || activeFilter === 'in_progress') &&
  inProgress.length > 0 && (
    <InProgressProjects projects={inProgress} />
)}

{(activeFilter === 'all' || activeFilter === 'planned') &&
  planned.length > 0 && (
    <PlannedProjects projects={planned} />
)}
          </>
        )}

      </div>
    </main>
  );
}
