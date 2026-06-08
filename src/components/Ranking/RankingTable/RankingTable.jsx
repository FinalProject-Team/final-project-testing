import { useState } from "react";

import { FaCrown, FaMedal, FaAward, FaStar } from "react-icons/fa";

import styles from "./RankingTable.module.css";

function RankingTable({ users, currentUserId }) {

  const [activeTab, setActiveTab] = useState("weekly");

  const sortedUsers = [...users].sort((a, b) => {

    if (activeTab === "weekly") {
      return b.weeklyXP - a.weeklyXP;
    }

    if (activeTab === "monthly") {
      return b.monthlyXP - a.monthlyXP;
    }

    return b.totalXP - a.totalXP;
  });

  const getRankIcon = (rank) => {

    if (rank === 1) {
      return <FaCrown className={styles.goldIcon} />;
    }

    if (rank === 2) {
      return <FaMedal className={styles.silverIcon} />;
    }

    if (rank === 3) {
      return <FaAward className={styles.bronzeIcon} />;
    }

    return <span className={styles.rankNumber}>#{rank}</span>;
  };

  return (

    <section className={styles.tableCard}>

      <div className={styles.header}>

        <h2>Full Rankings</h2>

        <div className={styles.tabs}>

          <button
            className={
              activeTab === "weekly"
                ? styles.activeTab
                : ""
            }
            onClick={() => setActiveTab("weekly")}
          >
            Weekly
          </button>

          <button
            className={
              activeTab === "monthly"
                ? styles.activeTab
                : ""
            }
            onClick={() => setActiveTab("monthly")}
          >
            Monthly
          </button>

          <button
            className={
              activeTab === "alltime"
                ? styles.activeTab
                : ""
            }
            onClick={() => setActiveTab("alltime")}
          >
            All Time
          </button>

        </div>

      </div>

      <div className={styles.list}>

        {sortedUsers.map((user, index) => (

          <div
            key={user.id}
            className={`${styles.rankingRow}
            ${
              user.id === currentUserId
                ? styles.currentUser
                : ""
            }`}
          >

            <div className="row align-items-center gy-3">

              <div className="col-2 col-sm-1">

                <div className={styles.rankBox}>
                  {getRankIcon(index + 1)}
                </div>

              </div>

              <div className="col-10 col-sm-7 col-lg-8">

                <div className="row align-items-center gx-3">

                  <div className="col-auto">

                    <div className={styles.avatarWrapper}>

                      <img
                        src={user.avatar}
                        alt={user.name}
                        className={styles.avatar}
                      />

                      {user.id === currentUserId && (
                        <span className={styles.youBadge}>
                          YOU
                        </span>
                      )}

                    </div>

                  </div>

                  <div className="col">

                    <div className={styles.nameLine}>

                      <h3>{user.name}</h3>

                      <span className={styles.level}>
                        {user.level}
                      </span>

                    </div>

                    <p>{user.role}</p>

                  </div>

                </div>

              </div>

              <div className="col-12 col-sm-4 col-lg-3">

                <div className={styles.xpBox}>

                  <strong>

                    <FaStar />

                    {activeTab === "weekly" &&
                      user.weeklyXP.toLocaleString()}

                    {activeTab === "monthly" &&
                      user.monthlyXP.toLocaleString()}

                    {activeTab === "alltime" &&
                      user.totalXP.toLocaleString()}

                  </strong>

                  <span>

                    {activeTab === "weekly" &&
                      "This Week"}

                    {activeTab === "monthly" &&
                      "This Month"}

                    {activeTab === "alltime" &&
                      "All Time"}

                  </span>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default RankingTable;