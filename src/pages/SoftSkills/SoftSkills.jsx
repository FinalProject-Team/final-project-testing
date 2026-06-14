import { useState, useEffect } from "react";
import SoftSkillsHero from "../../components/SoftSkills/SoftSkillsHero/SoftSkillsHero";
import SoftSkillsStats from "../../components/SoftSkills/SoftSkillsStats/SoftSkillsStats";
import SoftSkillsCard from "../../components/SoftSkills/SoftSkillsCard/SoftSkillsCard";
import { apiGetAllCourses, apiGetMyProgress } from "../../services/api/api";
import styles from "./SoftSkills.module.css";

const COLORS = ["#0EA5E9", "#06B6D4", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

function mapCourseToCard(course, index, progressMap) {
  const progress = progressMap[course.id] ?? course.progress ?? 0;
  const tags = course.tags
    || (course.category ? [course.category] : [])
    || (course.skills ? (Array.isArray(course.skills) ? course.skills : []) : ["Soft Skills"]);

  return {
    id: course.id || index + 1,
    title: course.title,
    subtitle: course.subtitle || course.description?.slice(0, 60) || "Professional development course",
    color: COLORS[index % COLORS.length],
    lessons: course.lessons_count || course.lessons?.length || 0,
    duration: course.duration || "Self-paced",
    rating: course.rating || 4.8,
    progress,
    xp: course.xp || course.price || 200,
    locked: course.is_locked || course.locked || false,
    tags: tags.slice(0, 4),
    description: course.description || "",
  };
}

function SoftSkills() {
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") || "dark"
  );
  const [activeCourse, setActiveCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [coursesRes, progressRes] = await Promise.allSettled([
          apiGetAllCourses(),
          apiGetMyProgress(),
        ]);

        const allCourses = coursesRes.status === "fulfilled"
          ? (Array.isArray(coursesRes.value) ? coursesRes.value : coursesRes.value?.courses || [])
          : [];

        const softCourses = allCourses.filter((c) => {
          const type = (c.course_type || c.category || c.track || "").toLowerCase();
          return type.includes("soft") || type.includes("skill") || type.includes("career");
        });

        const list = softCourses.length > 0 ? softCourses : allCourses.slice(0, 6);

        const progressMap = {};
        if (progressRes.status === "fulfilled") {
          const progressData = progressRes.value;
          const items = progressData?.courses || progressData?.progress || (Array.isArray(progressData) ? progressData : []);
          items.forEach((p) => {
            const id = p.course_id || p.id;
            if (id) progressMap[id] = p.progress ?? p.completion_percentage ?? 0;
          });
        }

        setCourses(list.map((c, i) => mapCourseToCard(c, i, progressMap)));
      } catch (err) {
        console.error("Failed to load soft skills courses:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("ct-theme", newTheme);
    setTheme(newTheme);
  };

  const inProgressCount = courses.filter((c) => c.progress > 0 && c.progress < 100).length;
  const totalXp = courses.reduce((sum, c) => sum + (c.xp || 0), 0);

  return (
    <div className={styles.softSkillsPage}>
      <button className={styles.themeBtn} onClick={handleThemeToggle}>
        {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
      </button>

      <SoftSkillsHero />

      <SoftSkillsStats
        totalCourses={courses.length}
        inProgress={inProgressCount}
        totalXp={totalXp}
        loading={loading}
      />

      {loading ? (
        <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>
          Loading courses...
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default SoftSkills;
