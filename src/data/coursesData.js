const courses = [

  {
    id: 1,

    title: "JavaScript Essentials",

    description:
      "Master JavaScript fundamentals and ES6 concepts.",

    level: "Intermediate",

    duration: "3 Months",

    students: 1200,

    rating: 4.8,

    price: 650,

    instructor: "Ahmed Hassan",

    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",

    isPurchased: false,

    lessons: [

      {
        id: 1,
        title: "Introduction to JavaScript",
        duration: "12 min",
        videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk",
        isFree: true,
      },

      {
        id: 2,
        title: "Variables and Data Types",
        duration: "25 min",
        videoUrl: "https://www.youtube.com/embed/hdI2bqOjy3c",
        isFree: false,
      },

      {
        id: 3,
        title: "Functions and Scope",
        duration: "30 min",
        videoUrl: "https://www.youtube.com/embed/N8ap4k_1QEQ",
        isFree: false,
      },

    ],
  },

  {
    id: 2,

    title: "React Bootcamp",

    description:
      "Build modern React applications from scratch.",

    level: "Intermediate",

    duration: "4 Months",

    students: 1500,

    rating: 5.0,

    price: 999,

    instructor: "Sara Ali",

    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee",

    isPurchased: false,

    lessons: [

      {
        id: 1,
        title: "React Introduction",
        duration: "15 min",
        videoUrl: "https://www.youtube.com/embed/Tn6-PIqc4UM",
        isFree: true,
      },

      {
        id: 2,
        title: "Components and Props",
        duration: "32 min",
        videoUrl: "https://www.youtube.com/embed/IYvD9oBCuJI",
        isFree: false,
      },

      {
        id: 3,
        title: "React Hooks",
        duration: "40 min",
        videoUrl: "https://www.youtube.com/embed/O6P86uwfdR0",
        isFree: false,
      },

    ],
  },

  {
    id: 3,

    title: "Node.js API Development",

    description:
      "Build backend APIs using Node.js and Express.",

    level: "Beginner",

    duration: "5 Months",

    students: 980,

    rating: 4.7,

    price: 899,

    instructor: "Mohamed Adel",

    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c",

    isPurchased: false,

    lessons: [

      {
        id: 1,
        title: "Introduction to Node.js",
        duration: "18 min",
        videoUrl: "https://www.youtube.com/embed/TlB_eWDSMt4",
        isFree: true,
      },

      {
        id: 2,
        title: "Express Basics",
        duration: "26 min",
        videoUrl: "https://www.youtube.com/embed/L72fhGm1tfE",
        isFree: false,
      },

      {
        id: 3,
        title: "REST APIs",
        duration: "35 min",
        videoUrl: "https://www.youtube.com/embed/pKd0Rpw7O48",
        isFree: false,
      },

    ],
  },

  {
    id: 4,

    title: "Machine Learning Basics",

    description:
      "Introduction to machine learning concepts.",

    level: "Intermediate",

    duration: "6 Months",

    students: 820,

    rating: 4.9,

    price: 1299,

    instructor: "Nour Khaled",

    image:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935",

    isPurchased: false,

    lessons: [

      {
        id: 1,
        title: "Machine Learning Intro",
        duration: "14 min",
        videoUrl: "https://www.youtube.com/embed/GwIo3gDZCVQ",
        isFree: true,
      },

      {
        id: 2,
        title: "Supervised Learning",
        duration: "28 min",
        videoUrl: "https://www.youtube.com/embed/7eh4d6sabA0",
        isFree: false,
      },

      {
        id: 3,
        title: "Neural Networks",
        duration: "38 min",
        videoUrl: "https://www.youtube.com/embed/aircAruvnKk",
        isFree: false,
      },

    ],
  },

  {
    id: 5,

    title: "React Masterclass",

    description:
      "Learn React from basics to advanced concepts.",

    level: "Advanced",

    duration: "5 Months",

    students: 2100,

    rating: 4.9,

    price: 1499,

    instructor: "Omar Fathy",

    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee",

    isPurchased: false,

    lessons: [

      {
        id: 1,
        title: "Advanced React Intro",
        duration: "15 min",
        videoUrl: "https://www.youtube.com/embed/bMknfKXIFA8",
        isFree: true,
      },

      {
        id: 2,
        title: "Context API",
        duration: "31 min",
        videoUrl: "https://www.youtube.com/embed/35lXWvCuM8o",
        isFree: false,
      },

      {
        id: 3,
        title: "Performance Optimization",
        duration: "42 min",
        videoUrl: "https://www.youtube.com/embed/SKCwQm9D4sI",
        isFree: false,
      },

    ],
  },

  {
    id: 6,

    title: "Full Stack Developer",

    description:
      "Learn frontend and backend development together.",

    level: "Advanced",

    duration: "8 Months",

    students: 2500,

    rating: 5.0,

    price: 1999,

    instructor: "Youssef Magdy",

    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085",

    isPurchased: false,

    lessons: [

      {
        id: 1,
        title: "Frontend vs Backend",
        duration: "16 min",
        videoUrl: "https://www.youtube.com/embed/zJSY8tbf_ys",
        isFree: true,
      },

      {
        id: 2,
        title: "Database Basics",
        duration: "34 min",
        videoUrl: "https://www.youtube.com/embed/HXV3zeQKqGY",
        isFree: false,
      },

      {
        id: 3,
        title: "Authentication System",
        duration: "39 min",
        videoUrl: "https://www.youtube.com/embed/mbsmsi7l3r4",
        isFree: false,
      },

    ],
  },

  {
    id: 7,

    title: "JavaScript Advanced",

    description:
      "Deep dive into advanced JavaScript concepts.",

    level: "Advanced",

    duration: "3 Months",

    students: 1000,

    rating: 4.8,

    price: 899,

    instructor: "Mariam Tarek",

    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c",

    isPurchased: false,

    lessons: [

      {
        id: 1,
        title: "Closures and Scope",
        duration: "17 min",
        videoUrl: "https://www.youtube.com/embed/3a0I8ICR1Vg",
        isFree: true,
      },

      {
        id: 2,
        title: "Promises and Async",
        duration: "29 min",
        videoUrl: "https://www.youtube.com/embed/PoRJizFvM7s",
        isFree: false,
      },

      {
        id: 3,
        title: "JavaScript Patterns",
        duration: "41 min",
        videoUrl: "https://www.youtube.com/embed/tM2mte7sG5s",
        isFree: false,
      },

    ],
  },

];

export default courses;