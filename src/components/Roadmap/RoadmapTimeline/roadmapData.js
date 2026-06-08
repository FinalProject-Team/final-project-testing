// ❌ STATIC DATA — fallback roadmap steps used when GET /api/roadmap/me is unavailable
// TODO: Remove once API returns roadmap data reliably
export const roadmapSteps = [
  {
    id: 1,
    title: 'Web Foundations',
    status: 'complete',
    xp: 500,
    skills: ['HTML5 Semantics', 'CSS Fundamentals', 'Git & Version Control'],
  },
  {
    id: 2,
    title: 'JavaScript Core',
    status: 'complete',
    xp: 750,
    skills: ['JS Syntax & ES6', 'Async Programming', 'DOM Manipulation'],
  },
  {
    id: 3,
    title: 'React Ecosystem',
    status: 'in-progress',
    xp: 1000,
    skills: ['React Hooks', 'State Management', 'React Router'],
  },
  {
    id: 4,
    title: 'Advanced Frontend',
    status: 'locked',
    xp: 1200,
    skills: ['TypeScript', 'Performance Optimization', 'Testing (Vitest)'],
  },
  {
    id: 5,
    title: 'APIs & Backend Basics',
    status: 'locked',
    xp: 1500,
    skills: ['REST APIs', 'Authentication', 'Databases Intro'],
  },
  {
    id: 6,
    title: 'Job Ready',
    status: 'locked',
    xp: 2000,
    skills: ['Portfolio Projects', 'Interview Prep', 'Technical Assessment'],
  },
];
