import styles from "./SoftSkillsStats.module.css";

function SoftSkillsStats() {
  return (
    <div className="row g-4">
      <div className="col-12 col-md-4">
        <div className={styles.statCard}>
          <h2>6</h2>
          <p>Courses Available</p>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className={styles.statCard}>
          <h2>2</h2>
          <p>In Progress</p>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className={styles.statCard}>
          <h2>2,400</h2>
          <p>XP Earnable</p>
        </div>
      </div>
    </div>
  );
}

export default SoftSkillsStats;