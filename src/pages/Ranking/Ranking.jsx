import RankingHero from "../../components/Ranking/RankingHero/RankingHero";
import TopThree from "../../components/Ranking/TopThree/TopThree";
import RankingTable from "../../components/Ranking/RankingTable/RankingTable";
import UserProgress from "../../components/Ranking/UserProgress/UserProgress";

import { currentUser, rankingUsers } from "../../data/rankingData.js";

import styles from "./Ranking.module.css";

export default function Ranking() {
  const topThreeUsers = rankingUsers.slice(0, 3);

  return (
    <main className={styles.rankingPage}>
      <div className="container-fluid">
        <div className="row gy-4">
          <div className="col-12">
            <RankingHero currentUser={currentUser} />
          </div>

          <div className="col-12">
            <TopThree users={topThreeUsers} />
          </div>

          <div className="col-12">
            <RankingTable
              users={rankingUsers}
              currentUserId={currentUser.id}
            />
          </div>

          <div className="col-12">
            <UserProgress currentUser={currentUser} />
          </div>
        </div>
      </div>
    </main>
  );
}