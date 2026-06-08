import styles from "./StatsCards.module.css";

export default function StatsCards({ course }) {
  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <h3>{course.students_count || 0}+</h3>
        <p>Students</p>
      </div>

      <div className={styles.statCard}>
        <h3>{course.duration}</h3>
        <p>Duration</p>
      </div>

      <div className={styles.statCard}>
        <h3>{course.rating}</h3>
        <p>Rating</p>
      </div>
    </div>
  );
}