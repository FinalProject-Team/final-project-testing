// ✅ CONNECTED TO API — fetches course data directly via axios → GET /api/courses
// ⚠️  FALLS BACK TO STATIC FALLBACK_STATS constant when API is unavailable
import { useEffect, useRef, useState } from 'react';
import styles from './Stats.module.css';
import { apiGetAllCourses } from '../../services/api/api';

const FALLBACK_STATS = [
  { value: 50000, suffix: '+', label: 'Active Students' },
  { value: 120,   suffix: '+', label: 'Expert Courses' },
  { value: 8500,  suffix: '+', label: 'Jobs Matched' },
  { value: 94,    suffix: '%', label: 'Success Rate' },
];

function Counter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let current = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) { setCount(end); clearInterval(timer); }
      else { setCount(Math.floor(current)); }
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return <div ref={ref}>{Number.isInteger(end) ? count.toLocaleString() : count.toFixed(1)}{suffix}</div>;
}

export default function Stats() {
  const [stats, setStats] = useState(FALLBACK_STATS);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const courses = await apiGetAllCourses();
        const list = Array.isArray(courses) ? courses : courses?.courses || [];

        const totalStudents = list.reduce((s, c) => s + (Number(c.students_count) || 0), 0);
        const validRatings = list.filter((c) => typeof c.rating === 'number' && c.rating > 0);
        const avgRating = validRatings.length > 0
          ? validRatings.reduce((s, c) => s + c.rating, 0) / validRatings.length
          : 4.9;

        const trackCount = new Set(list.map((c) => c.track).filter(Boolean)).size;

        setStats([
          { value: totalStudents > 0 ? totalStudents : 50000, suffix: '+', label: 'Active Students' },
          { value: list.length > 0 ? list.length : 120, suffix: list.length > 0 ? '' : '+', label: 'Expert Courses' },
          { value: trackCount > 0 ? trackCount : 8500, suffix: trackCount > 0 ? '' : '+', label: trackCount > 0 ? 'Learning Tracks' : 'Jobs Matched' },
          { value: Math.round(avgRating * 10), suffix: '%', label: 'Success Rate' },
        ]);
      } catch (err) {
        console.error('Stats fetch failed, using defaults:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className={styles.stats}>
      <div className={styles.statsContainer}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statValue}>
              <Counter end={stat.value} suffix={stat.suffix} />
            </div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
