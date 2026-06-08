// =====================================================
//  CareerTech – Community Dummy Data
//  TODO: Replace with real API responses
// =====================================================

export const POSTS_DATA = [
  {
    id: 1,
    authorId: "u_002",
    type: "Discussion",
    author: {
      name: "Ahmed Magdy",
      role: "Frontend Developer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
      verified: true,
      level: 14,
    },
    timeAgo: "2h ago",
    content:
      "As a Frontend Developer — هل لازم أتعلم System Design؟\nعايز أتعلم الـ System Design لكن من ناحية الـ Frontend، حد عنده Roadmap أو مصادر مفيدة برشحها؟",
    tags: ["#SystemDesign", "#Frontend"],
    likes: 24,
    comments: 2,
    saves: 5,
    liked: false,
    saved: false,
    commentList: [
      {
        id: 101,
        author: { name: "Nourhan Ali", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nourhan", role: "UI/UX Designer" },
        text: "أنصحك بـ ByteByteGo — عندهم محتوى Frontend-focused كتير أوي!",
        timeAgo: "1h ago",
        likes: 5,
        liked: false,
      },
      {
        id: 102,
        author: { name: "Sara Mohamed", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara", role: "Full Stack Developer" },
        text: "ابدأ بـ Designing Data-Intensive Applications، هتفهم كتير.",
        timeAgo: "45m ago",
        likes: 3,
        liked: false,
      },
    ],
  },
  {
    id: 2,
    authorId: "u_003",
    type: "Showcase",
    author: {
      name: "Nourhan Ali",
      role: "UI/UX Designer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nourhan",
      verified: false,
      level: 11,
    },
    timeAgo: "5h ago",
    content:
      "My Dashboard Design - Feedback is appreciated! ✨\nSpent 2 weeks on this analytics dashboard concept. Used Figma + Auto Layout. Would love your thoughts on the color palette and data viz approach!",
    tags: ["#UIDesign", "#Dashboard", "#Figma"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    likes: 36,
    comments: 0,
    saves: 14,
    liked: true,
    saved: false,
    commentList: [],
  },
  {
    id: 3,
    authorId: "u_004",
    type: "Poll",
    author: {
      name: "Youssef Hassan",
      role: "Backend Developer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Youssef",
      verified: false,
      level: 9,
    },
    timeAgo: "7h ago",
    content: "What's your preferred backend framework in 2024?",
    tags: ["#Backend", "#Poll"],
    poll: {
      options: [
        { label: "Node.js / Express", votes: 142, percent: 45 },
        { label: "Django / FastAPI",  votes: 89,  percent: 28 },
        { label: "Laravel / PHP",     votes: 57,  percent: 18 },
        { label: "Spring Boot",       votes: 28,  percent: 9  },
      ],
      totalVotes: 316,
      voted: null,
    },
    likes: 19,
    comments: 0,
    saves: 3,
    liked: false,
    saved: true,
    commentList: [],
  },
  {
    id: 4,
    authorId: "u_005",
    type: "Article",
    author: {
      name: "Sara Mohamed",
      role: "Full Stack Developer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
      verified: true,
      level: 16,
    },
    timeAgo: "1d ago",
    content:
      "🚀 10 React Performance Tips That Actually Matter in 2024\nFrom useMemo pitfalls to Suspense boundaries — I compiled the patterns that genuinely moved the needle in production apps I've worked on. Thread below 👇",
    tags: ["#React", "#Performance", "#WebDev"],
    readTime: "5 min read",
    likes: 87,
    comments: 0,
    saves: 41,
    liked: false,
    saved: false,
    commentList: [],
  },
  {
    id: 5,
    authorId: "u_006",
    type: "Job",
    author: {
      name: "TechCorp Egypt",
      role: "Hiring Manager",
      avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=TechCorp",
      verified: true,
      level: null,
    },
    timeAgo: "2d ago",
    content:
      "🔔 We're Hiring: Senior React Developer\n📍 Cairo / Remote | 💰 $2,500–$4,000/mo\n✅ 3+ years React | TypeScript | Node.js\n🎯 Exciting product team, great culture, equity included.",
    tags: ["#Hiring", "#React", "#Remote"],
    jobDetails: {
      company: "TechCorp Egypt",
      location: "Cairo / Remote",
      salary: "$2,500–$4,000/mo",
      type: "Full-time",
    },
    likes: 45,
    comments: 0,
    saves: 28,
    liked: false,
    saved: false,
    commentList: [],
  },
];

export const TRENDING_TOPICS = [
  { tag: "JavaScript", posts: "1.2k" },
  { tag: "Frontend",   posts: "980" },
  { tag: "Career",     posts: "870" },
  { tag: "Projects",   posts: "640" },
  { tag: "SystemDesign", posts: "520" },
  { tag: "React",      posts: "490" },
  { tag: "Python",     posts: "410" },
];

export const LEADERBOARD = [
  { rank: 1, name: "Mohamed Ashraf", xp: 2480, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohamed", badge: "👑" },
  { rank: 2, name: "Nourhan Ali",    xp: 2150, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nourhan", badge: "🥈" },
  { rank: 3, name: "Ahmed Magdy",    xp: 1980, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",   badge: "🥉" },
  { rank: 4, name: "Sara Mohamed",   xp: 1620, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",    badge: "" },
  { rank: 5, name: "Omar Tarek",     xp: 1410, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar",    badge: "" },
];

export const UPCOMING_EVENTS = [
  { id: 1, title: "Build with AI Workshop",           date: "24 May, 2024", time: "7:00 PM", icon: "🤖", color: "#4f8ef7" },
  { id: 2, title: "Career Talk: From Zero to Job Offer", date: "28 May, 2024", time: "8:00 PM", icon: "💼", color: "#a78bfa" },
  { id: 3, title: "Frontend Challenge",                date: "1 June, 2024", time: "6:00 PM", icon: "🎨", color: "#34d399" },
];

export const SUGGESTED_MEMBERS = [
  { id: 1, name: "Layla Hassan", role: "React Developer",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Layla", mutual: 4 },
  { id: 2, name: "Karim Nasser", role: "DevOps Engineer",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karim", mutual: 7 },
  { id: 3, name: "Dina Farouk",  role: "Product Manager",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dina",  mutual: 2 },
];
