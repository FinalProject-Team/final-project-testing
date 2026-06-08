export const formatDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
};

export const getTechColor = (tech) => {
  const map = {
    React: '#61DAFB',
    'Node.js': '#68A063',
    MongoDB: '#47A248',
    Tailwind: '#38BDF8',
    TypeScript: '#3178C6',
    API: '#A855F7',
    'Next.js': '#FFFFFF',
    Prisma: '#5A67D8',
    PostgreSQL: '#336791',
    'Socket.io': '#010101',
    Storybook: '#FF4785',
    'CSS Modules': '#264de4',
    Jest: '#C21325',
    Python: '#3776AB',
    OpenAI: '#10A37F',
    'GitHub API': '#F0F6FC',
    FastAPI: '#009688',
    Go: '#00ACD7',
    ClickHouse: '#FFCC00',
    'D3.js': '#F9A03C',
    'Socket.io': '#25c2a0',
  };
  return map[tech] || '#94A3B8';
};

export const clsx = (...classes) => classes.filter(Boolean).join(' ');
