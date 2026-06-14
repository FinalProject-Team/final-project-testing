import { useState, useEffect } from "react";
import RankingHero from "../../components/Ranking/RankingHero/RankingHero";
import TopThree from "../../components/Ranking/TopThree/TopThree";
import RankingTable from "../../components/Ranking/RankingTable/RankingTable";
import UserProgress from "../../components/Ranking/UserProgress/UserProgress";
import { currentUser as defaultCurrentUser, rankingUsers as defaultRankingUsers } from "../../data/rankingData.js";
import { apiGetLeaderboard, apiGetMyRank } from "../../services/api/api";
import styles from "./Ranking.module.css";

export default function Ranking() {
  const [users, setUsers] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRankingData = async () => {
      try {
        setLoading(true);
        const [rankingData, meData] = await Promise.all([
          apiGetLeaderboard(),
          apiGetMyRank(),
        ]);

        if (rankingData && rankingData.length > 0) {
          const formattedUsers = rankingData.map((u) => ({
            id: u.id,
            name: u.full_name || u.name || "Student",
            role: u.role || "Frontend Student",
            weeklyXP: u.weekly_xp ?? u.xp ?? 0,
            monthlyXP: u.monthly_xp ?? u.xp ?? 0,
            totalXP: u.total_xp ?? u.xp ?? 0,
            level: u.level || "Intermediate",
            avatar: u.avatar_url || `https://i.pravatar.cc/100?img=${(u.id || 0) % 70}`,
          }));
          setUsers(formattedUsers);
        } else {
          setUsers(defaultRankingUsers);
        }

        if (meData) {
          setMe({
            id: meData.id,
            name: meData.full_name || meData.name || "Me",
            role: meData.role || "Frontend Student",
            rank: meData.rank || 7,
            weeklyXP: meData.weekly_xp ?? meData.xp ?? 0,
            monthlyXP: meData.monthly_xp ?? meData.xp ?? 0,
            totalXP: meData.total_xp ?? meData.xp ?? 0,
            level: meData.level || "Intermediate",
            avatar: meData.avatar_url || `https://i.pravatar.cc/100?img=${(meData.id || 0) % 70}`,
          });
        } else {
          setMe(defaultCurrentUser);
        }
      } catch (err) {
        console.warn("Failed to load ranking from API, using mock:", err);
        setUsers(defaultRankingUsers);
        setMe(defaultCurrentUser);
      } finally {
        setLoading(false);
      }
    };
    loadRankingData();
  }, []);

  const topThreeUsers = users.slice(0, 3);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh", color: "white" }}>
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading leaderboard rankings...</span>
        </div>
      </div>
    );
  }

  return (
    <main className={styles.rankingPage}>
      <div className="container-fluid">
        <div className="row gy-4">
          <div className="col-12">
            <RankingHero currentUser={me || defaultCurrentUser} />
          </div>

          <div className="col-12">
            <TopThree users={topThreeUsers.length > 0 ? topThreeUsers : defaultRankingUsers.slice(0, 3)} />
          </div>

          <div className="col-12">
            <RankingTable
              users={users.length > 0 ? users : defaultRankingUsers}
              currentUserId={(me || defaultCurrentUser).id}
            />
          </div>

          <div className="col-12">
            <UserProgress currentUser={me || defaultCurrentUser} />
          </div>
        </div>
      </div>
    </main>
  );
}