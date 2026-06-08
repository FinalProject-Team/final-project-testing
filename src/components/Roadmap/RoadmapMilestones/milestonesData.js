// ❌ STATIC DATA — fallback milestone badges used when API data is unavailable
// TODO: Replace with real user milestones from GET /api/roadmap/milestones
export const milestones = [
  {
    id: 1,
    icon: 'code',
    title: 'First Code',
    status: 'achieved',
    color: 'cyan',
  },
  {
    id: 2,
    icon: 'zap',
    title: 'Week Streak',
    status: 'achieved',
    color: 'cyan',
  },
  {
    id: 3,
    icon: 'star',
    title: 'First Project',
    status: 'achieved',
    color: 'purple',
  },
  {
    id: 4,
    icon: 'lock',
    title: 'Job Ready',
    status: 'locked',
    color: 'locked',
  },
];
