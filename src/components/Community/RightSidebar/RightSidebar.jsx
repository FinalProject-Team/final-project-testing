import styles from "./RightSidebar.module.css";
import { SideWidgetSkeleton } from "../Skeletons/Skeletons";
import { useFetch } from "./../../../hooks/useFetch";
import { apiGetLeaderboard } from "./../../../services/api/api";
import { BsTrophy } from "react-icons/bs";

/* ── Leaderboard — wired to the real ranking API (GET /api/ranking) ── */
function LeaderboardWidget() {
  const { data, loading, error } = useFetch(apiGetLeaderboard);

  // Normalize: backend may return the array directly, or wrapped as
  // { data: [...] } / { ranking: [...] } / { users: [...] }
  const raw = Array.isArray(data)
    ? data
    : data?.data || data?.ranking || data?.users || data?.leaderboard || [];

  const items = raw.slice(0, 5).map((u, i) => ({
    rank: u.rank ?? i + 1,
    name: u.full_name || u.name || "Student",
    xp: u.total_xp ?? u.xp ?? u.weekly_xp ?? 0,
    avatar:
      u.avatar_url ||
      u.avatar ||
      `https://i.pravatar.cc/100?img=${(u.id ?? i) % 70}`,
    badge: i === 0 ? "👑" : i === 1 ? "🥈" : i === 2 ? "🥉" : "",
  }));

  return (
    <div className={styles.widget}>
      <div className={styles.widgetHeader}>
        <span className={styles.widgetTitle}>
          <BsTrophy style={{ color: "#fbbf24" }} /> Top Contributors
        </span>
        <span className={styles.viewAll}>View leaderboard</span>
      </div>
      {loading && <SideWidgetSkeleton lines={5} />}
      {error && !loading && <p className={styles.error}>{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p className={styles.error}>No ranking data yet.</p>
      )}
      {items.map((item) => (
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
