// ❌ STATIC DATA — fallback project templates used when GET /api/projects/me is unavailable
// TODO: Remove once API returns project data reliably
export const projects = [
  {
    id: 1,
    title: 'Personal Portfolio Site',
    xp: 150,
    level: 'Beginner',
    tags: ['HTML', 'CSS', 'JS'],
  },
  {
    id: 2,
    title: 'E-commerce Product Page',
    xp: 300,
    level: 'Intermediate',
    tags: ['React', 'State'],
  },
  {
    id: 3,
    title: 'Real-time Chat App',
    xp: 500,
    level: 'Advanced',
    tags: ['React', 'WebSockets'],
  },
];

export const tips = [
  {
    id: 1,
    color: 'cyan',
    text: 'Focus on React Custom Hooks — it appears in 78% of Frontend job requirements.',
  },
  {
    id: 2,
    color: 'purple',
    text: 'Your TypeScript score is below average. Completing 2 more challenges will unlock Senior path.',
  },
  {
    id: 3,
    color: 'green',
    text: '3 companies in your area are hiring React developers matching your current level.',
  },
];
