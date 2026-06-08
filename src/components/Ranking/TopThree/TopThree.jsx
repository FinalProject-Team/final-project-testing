import { FaCrown } from "react-icons/fa";
import styles from "./TopThree.module.css";

function TopThree({ users }) {
  const second = users[1];
  const first = users[0];
  const third = users[2];

  return (
    <section className={styles.topThree}>
      <div className="row align-items-end justify-content-center gy-4">
        {[second, first, third].map((user) => (
          <div key={user.id} className="col-12 col-md-4 text-center">
            <div className={styles.userInfo}>
              {user.rank === 1 && <FaCrown className={styles.crown} />}

              <img
                src={user.avatar}
                alt={user.name}
                className={styles.avatar}
              />

              <h5>{user.name}</h5>
              <span>{user.totalXP.toLocaleString()} XP</span>
            </div>

            <div
              className={`${styles.podium} ${
                user.rank === 1
                  ? styles.first
                  : user.rank === 2
                  ? styles.second
                  : styles.third
              }`}
            >
              #{user.rank}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TopThree;