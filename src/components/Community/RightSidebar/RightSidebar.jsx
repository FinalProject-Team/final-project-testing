// ⚠️  USES MOCK API — calls getTrendingTopics/getLeaderboard/getEvents/getSuggestedMembers
//    from src/api/communityApi.js which wraps STATIC data from src/data/communityData.js with fake delays
// TODO: Switch communityApi.js to real axios calls when backend is ready
import { useState } from "react";
import styles from "./RightSidebar.module.css";
import { SideWidgetSkeleton } from "../Skeletons/Skeletons";
import { useFetch } from "../../../hooks/useFetch";
import { getTrendingTopics, getLeaderboard, getEvents, getSuggestedMembers } from "../../../api/communityApi";
import { followUser } from "../../../services/community/communityService";
import { RiFireLine } from "react-icons/ri";
import { BsCalendarEvent, BsTrophy, BsPersonPlus } from "react-icons/bs";

function TrendingWidget() {
  const { data, loading, error } = useFetch(getTrendingTopics);
  return (
    <div className={styles.widget}>
      <div className={styles.widgetHeader}>
        <span className={styles.widgetTitle}><RiFireLine style={{ color: "#f97316" }} /> Trending Topics</span>
        <span className={styles.viewAll}>View all</span>
      </div>
      {loading && <SideWidgetSkeleton lines={5} />}
      {error   && <p className={styles.error}>{error}</p>}
      {data && data.map((item) => (
        <div key={item.tag} className={styles.trendingItem}>
          <div className={styles.trendingLeft}>
            <span className={styles.hash}>#</span>
            <span className={styles.tag}>{item.tag}</span>
          </div>
          <span className={styles.count}>{item.posts} posts</span>
        </div>
      ))}
    </div>
  );
}

function LeaderboardWidget() {
  const { data, loading, error } = useFetch(getLeaderboard);
  return (
    <div className={styles.widget}>
      <div className={styles.widgetHeader}>
        <span className={styles.widgetTitle}><BsTrophy style={{ color: "#fbbf24" }} /> Top Contributors</span>
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

function EventsWidget() {
  const { data, loading, error } = useFetch(getEvents);
  return (
    <div className={styles.widget}>
      <div className={styles.widgetHeader}>
        <span className={styles.widgetTitle}><BsCalendarEvent style={{ color: "#a78bfa" }} /> Upcoming Events</span>
        <span className={styles.viewAll}>View all</span>
      </div>
      {loading && <SideWidgetSkeleton lines={3} />}
      {error   && <p className={styles.error}>{error}</p>}
      {data && data.map((ev) => (
        <div key={ev.id} className={styles.eventItem}>
          <div className={styles.eventIcon} style={{ background: `${ev.color}18`, border: `1px solid ${ev.color}33` }}>
            {ev.icon}
          </div>
          <div className={styles.eventInfo}>
            <div className={styles.eventTitle}>{ev.title}</div>
            <div className={styles.eventMeta}>{ev.date} · {ev.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SuggestedMembersWidget() {
  const { data, loading, error } = useFetch(getSuggestedMembers);
  const [followed, setFollowed] = useState({});

  async function toggle(id) {
    // TODO: Connect to followUser service when backend is ready
    await followUser(id);
    setFollowed((f) => ({ ...f, [id]: !f[id] }));
  }

  return (
    <div className={styles.widget}>
      <div className={styles.widgetHeader}>
        <span className={styles.widgetTitle}><BsPersonPlus style={{ color: "#34d399" }} /> Suggested Members</span>
      </div>
      {loading && <SideWidgetSkeleton lines={3} />}
      {error   && <p className={styles.error}>{error}</p>}
      {data && data.map((m) => (
        <div key={m.id} className={styles.memberItem}>
          <img src={m.avatar} alt={m.name} className={styles.memberAvatar} />
          <div className={styles.memberInfo}>
            <div className={styles.memberName}>{m.name}</div>
            <div className={styles.memberRole}>{m.role}</div>
          </div>
          <button
            className={`${styles.followBtn} ${followed[m.id] ? styles.following : ""}`}
            onClick={() => toggle(m.id)}
          >
            {followed[m.id] ? "✓ Following" : "+ Follow"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default function RightSidebar() {
  return (
    <aside className={styles.sidebar}>
      <TrendingWidget />
      <LeaderboardWidget />
      <EventsWidget />
      <SuggestedMembersWidget />
    </aside>
  );
}
