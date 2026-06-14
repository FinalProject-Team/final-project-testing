import styles from "./SoftSkillsStats.module.css";

function SoftSkillsStats({ totalCourses = 0, inProgress = 0, totalXp = 0, loading = false }) {
  return (
    <div className="row g-4">
      <div className="col-12 col-md-4">
        <div className={styles.statCard}>
          <h2>{loading ? "—" : totalCourses}</h2>
          <p>Courses Available</p>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className={styles.statCard}>
          <h2>{loading ? "—" : inProgress}</h2>
          <p>In Progress</p>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className={styles.statCard}>
          <h2>{loading ? "—" : totalXp.toLocaleString()}</h2>
          <p>XP Earnable</p>
        </div>
      </div>
    </div>
  );
}

export default SoftSkillsStats;
