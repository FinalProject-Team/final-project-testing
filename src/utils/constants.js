import { PROJECT_STATUS } from '../data/projectsData';

export { PROJECT_STATUS };

export const FILTER_TABS = [
  { id: 'all', label: 'All Projects', icon: '⊞' },
  { id: PROJECT_STATUS.COMPLETED, label: 'Completed', icon: '✓' },
  { id: PROJECT_STATUS.IN_PROGRESS, label: 'In Progress', icon: '◐' },
  { id: PROJECT_STATUS.PLANNED, label: 'Planned', icon: '○' },
];

export const STATUS_CONFIG = {
  [PROJECT_STATUS.COMPLETED]: {
    label: 'Completed',
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.3)',
    dot: '#10B981',
  },
  [PROJECT_STATUS.IN_PROGRESS]: {
    label: 'In Progress',
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.3)',
    dot: '#F59E0B',
  },
  [PROJECT_STATUS.PLANNED]: {
    label: 'Planned',
    color: '#A855F7',
    bg: 'rgba(168, 85, 247, 0.12)',
    border: 'rgba(168, 85, 247, 0.3)',
    dot: '#A855F7',
  },
};

export const PROGRESS_COLORS = {
  [PROJECT_STATUS.COMPLETED]: 'linear-gradient(90deg, #10B981, #34D399)',
  [PROJECT_STATUS.IN_PROGRESS]: 'linear-gradient(90deg, #0EA5E9, #22D3EE)',
  [PROJECT_STATUS.PLANNED]: 'linear-gradient(90deg, #A855F7, #C084FC)',
};

export const SIDEBAR_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊡' },
  { id: 'projects', label: 'Projects', icon: '◫', active: true },
  { id: 'skills', label: 'Skills', icon: '◈' },
  { id: 'experience', label: 'Experience', icon: '◉' },
  { id: 'blog', label: 'Blog', icon: '◧' },
  { id: 'contact', label: 'Contact', icon: '◍' },
];
