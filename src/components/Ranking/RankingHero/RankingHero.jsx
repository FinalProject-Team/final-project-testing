import styles from "./RankingHero.module.css";

function RankingHero({ currentUser }) {
  return (
    <section className={styles.heroCard}>
      <div className="row align-items-center">
        
        <div className="col-12 col-md-8">
          <span className={styles.badge}>
            Global Leaderboard
          </span>

          <h1 className={styles.title}>
            Weekly XP Rankings
          </h1>

          <p className={styles.description}>
            Resets every Monday. Top 3 earn exclusive badges.
          </p>
        </div>

        <div className="col-12 col-md-4 d-flex justify-content-md-end mt-4 mt-md-0">
          <div className={styles.rankCard}>
            
            <h2 className={styles.rankNumber}>
              #{currentUser.rank}
            </h2>

            <p className={styles.rankText}>
              Your Rank
            </p>

            <h3 className={styles.xp}>
              {currentUser.weeklyXP.toLocaleString()} XP
            </h3>

            <p className={styles.weekText}>
              this week
            </p>

          </div>
        </div>

      </div>
    </section>
  );
}

export default RankingHero;