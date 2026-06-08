import styles from "./SoftSkillsProgress.module.css";

function SoftSkillsProgress({ progress, color }) {
  return (
    <div className={styles.progressWrapper}>
      <div className={styles.progressInfo}>
        <span>Progress</span>
        <span style={{ color }}>{progress}%</span>
      </div>

      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{
            width: `${progress}%`,
            background: color,
          }}
        ></div>
      </div>
    </div>
  );
}

export default SoftSkillsProgress;