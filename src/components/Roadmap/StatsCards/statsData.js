// ❌ STATIC DATA — fallback stats (lessons, challenges, XP) used when API data is unavailable
// TODO: Replace with real data from GET /api/dashboard/stats
export const statsData = [
  {
    id: 'lessons',
    icon: 'book',
    current: 4,
    total: 7,
    label: 'Lessons Completed',
    color: 'cyan',
  },
  {
    id: 'challenges',
    icon: 'code',
    current: 2,
    total: 5,
    label: 'Coding Challenges',
    color: 'cyan',
  },
  {
    id: 'xp',
    icon: 'target',
    current: 840,
    total: 1200,
    label: 'Weekly XP Goal',
    color: 'purple',
  },
];
