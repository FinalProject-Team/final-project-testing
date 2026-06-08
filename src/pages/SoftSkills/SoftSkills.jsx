import { useState } from "react";
import SoftSkillsHero from "../../components/SoftSkills/SoftSkillsHero/SoftSkillsHero";
import SoftSkillsStats from "../../components/SoftSkills/SoftSkillsStats/SoftSkillsStats";
import SoftSkillsCard from "../../components/SoftSkills/SoftSkillsCard/SoftSkillsCard";
import styles from "./SoftSkills.module.css";

function SoftSkills() {
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") || "dark"
  );

  const [activeCourse, setActiveCourse] = useState(null);

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("ct-theme", newTheme);
    setTheme(newTheme);
  };

  const courses = [
    {
      id: 1,
      title: "Freelancing Masterclass",
      subtitle: "Build a 6-figure freelance business",
      color: "#0EA5E9",
      lessons: 12,
      duration: "4h 30m",
      rating: 4.8,
      progress: 65,
      xp: 400,
      locked: false,
      tags: ["Pricing", "Clients", "Contracts", "Portfolio"],
      description:
        "Learn how to land high-paying freelance clients and manage projects professionally.",
    },

    {
      id: 2,
      title: "Professional Communication",
      subtitle: "Master written & verbal communication",
      color: "#06B6D4",
      lessons: 10,
      duration: "3h 15m",
      rating: 4.9,
      progress: 30,
      xp: 350,
      locked: false,
      tags: ["Writing", "Presentations", "Email", "Slack"],
      description: "Improve communication skills for work.",
    },

    {
      id: 3,
      title: "Tech Leadership Essentials",
      subtitle: "From IC to engineering leader",
      color: "#8B5CF6",
      lessons: 15,
      duration: "6h 20m",
      rating: 4.7,
      progress: 0,
      xp: 500,
      locked: false,
      tags: ["Team Management", "Feedback", "1:1s", "Vision"],
      description: "Develop leadership and management skills.",
    },

    {
      id: 4,
      title: "Decision Making Simulations",
      subtitle: "AI-powered scenario-based learning",
      color: "#EC4899",
      lessons: 8,
      duration: "2h 45m",
      rating: 4.6,
      progress: 0,
      xp: 300,
      locked: false,
      tags: ["Critical Thinking", "Trade-offs", "Data", "Clarity"],
      description: "Practice decision making in real scenarios.",
    },

    {
      id: 5,
      title: "Time Management for Devs",
      subtitle: "Deep work, flow state, and focus",
      color: "#10B981",
      lessons: 9,
      duration: "3h 00m",
      rating: 4.8,
      progress: 0,
      xp: 250,
      locked: false,
      tags: ["Deep Work", "Pomodoro", "Focus", "Productivity"],
      description: "Boost productivity and focus.",
    },

    {
      id: 6,
      title: "Salary Negotiation",
      subtitle: "Get paid what you're worth",
      color: "#F59E0B",
      lessons: 6,
      duration: "1h 50m",
      rating: 4.9,
      progress: 0,
      xp: 200,
      locked: true,
      tags: ["Offer Letters", "Counter", "Leverage", "Scripts"],
      description: "Learn negotiation strategies.",
    },
  ];

  return (
    <div className={styles.softSkillsPage}>
      <button
        className={styles.themeBtn}
        onClick={handleThemeToggle}
      >
        {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
      </button>

      <SoftSkillsHero />

      <SoftSkillsStats />

      <div className="row g-4 mt-2">
        {courses.map((course) => (
          <SoftSkillsCard
            key={course.id}
            course={course}
            activeCourse={activeCourse}
            setActiveCourse={setActiveCourse}
          />
        ))}
      </div>
    </div>
  );
}

export default SoftSkills;