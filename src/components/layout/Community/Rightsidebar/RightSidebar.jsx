import { useState } from "react";
import styles from "./RightSidebar.module.css";
import { SideWidgetSkeleton } from "../Skeletons/Skeletons";
import { useFetch } from "../../../../hooks/useFetch";
import { getLeaderboard } from "../../../../api/communityApi";
import { RiFireLine } from "react-icons/ri";
import { BsCalendarEvent, BsTrophy, BsPersonPlus } from "react-icons/bs";
import {TRENDING_TOPICS} from "../../../../data/communityData";



/* ── Leaderboard (fetched via communityApi) ── */
function LeaderboardWidget() {
  const { data, loading, error } = useFetch(getLeaderboard);
  return (
    <div className={styles.widget}>
      <div className={styles.widgetHeader}>
        <span className={styles.widgetTitle}>
          <BsTrophy style={{ color: "#fbbf24" }} /> Top Contributors
        </span>
        <span className={styles.viewAll}>View leaderboard</span>
      </div>
      {loading && <SideWidgetSkeleton lines={5} />}
      {error   && <p className={styles.error}>{error}</p>}
      {data && data.map((item) => (
        <div key={item.rank} className={styles.leaderItem}>
          <span className={styles.rank}>{item.rank}</span>
          <img src={item.avatar} alt={item.name} className={styles.leaderAvatar} />
          <div className={styles.leaderInfo}>
            <div className={styles.leaderName}>{item.name}</div>
            <div className={styles.leaderXp}>{item.xp.toLocaleString()} XP</div>
          </div>
          {item.badge && <span className={styles.badge}>{item.badge}</span>}
        </div>
      ))}
    </div>
  );
}

  

export default function RightSidebar() {
  return (
    <aside className={styles.sidebar}>
      <LeaderboardWidget />
    </aside>
  );
}
