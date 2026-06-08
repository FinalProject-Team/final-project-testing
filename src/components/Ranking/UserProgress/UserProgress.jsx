import { FaBolt } from "react-icons/fa";
import styles from "./UserProgress.module.css";

function UserProgress({ currentUser }) {
  const targetRankXP = 11200;
  const remainingXP = targetRankXP - currentUser.totalXP;
  const progressPercent = Math.min(
    Math.round((currentUser.totalXP / targetRankXP) * 100),
    100
  );

  return (
    <section className={styles.progressCard}>
      <div className={styles.iconBox}>
        <FaBolt />
      </div>

      <div className={styles.content}>
        <h3>
          You're #{currentUser.rank} — climb to top 5!
        </h3>

        <p>
          Need <span>{remainingXP.toLocaleString()} more XP</span> to reach #5
        </p>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      <button className={styles.button}>
        Keep Learning
      </button>
    </section>
  );
}

export default UserProgress;