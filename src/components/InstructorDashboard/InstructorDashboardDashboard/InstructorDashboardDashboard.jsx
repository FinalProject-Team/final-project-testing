import { useEffect, useState } from "react";
import { BookOpen, FileText, Users, Video } from "lucide-react";
import {
  getInstructorDashboard,
  getLiveSessions,
} from "../../../services/api/instructorService";
import styles from "./InstructorDashboardDashboard.module.css";

function InstructorDashboardDashboard() {
  const [dashboardStats, setDashboardStats] = useState({
    totalCourses: 0,
    totalLessons: 0,
    totalStudents: 0,
  });

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getInstructorDashboard();

        setDashboardStats({
          totalCourses: data.totalCourses || 0,
          totalLessons: data.totalLessons || 0,
          totalStudents: data.totalStudents || 0,
        });
      } catch (err) {
        console.error("Failed to load instructor dashboard:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    const fetchLiveSessions = async () => {
      try {
        setSessionsLoading(true);

        const response = await getLiveSessions();

        setSessions(response.data || []);
      } catch (err) {
        console.error("Failed to load live sessions:", err);
        setSessions([]);
      } finally {
        setSessionsLoading(false);
      }
    };

    fetchDashboardData();
    fetchLiveSessions();
  }, []);

  const stats = [
    {
      title: "Total Courses",
      value: dashboardStats.totalCourses,
      icon: BookOpen,
    },
    {
      title: "Total Lessons",
      value: dashboardStats.totalLessons,
      icon: FileText,
    },
    {
      title: "Total Students",
      value: dashboardStats.totalStudents,
      icon: Users,
    },
  ];

  const formatDate = (dateValue) => {
    if (!dateValue) return "No date";

    return new Date(dateValue).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <section className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening with your courses.</p>
      </div>

      {loading && <p className={styles.loading}>Loading dashboard data...</p>}

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.statsGrid}>
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div className={styles.statCard} key={item.title}>
              <div>
                <p>{item.title}</p>
                <h2>{item.value}</h2>
              </div>

              <div className={styles.iconBox}>
                <Icon size={26} />
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.bottomGrid}>
        <div className={styles.panel}>
          <h3>Recent Activity</h3>

          <div className={styles.list}>
            <div className={styles.listItem}>
              <div>
                <h4>No recent activity yet</h4>
                <p>Activity API is not available yet.</p>
              </div>

              <span>—</span>
            </div>
          </div>
        </div>

        <div className={styles.panel}>
          <h3>Upcoming Interactive Sessions</h3>

          <div className={styles.list}>
            {sessionsLoading && (
              <div className={styles.sessionItem}>
                <div className={styles.smallIcon}>
                  <Video size={18} />
                </div>

                <div>
                  <h4>Loading sessions...</h4>
                  <p>Please wait</p>
                </div>
              </div>
            )}

            {!sessionsLoading && sessions.length === 0 && (
              <div className={styles.sessionItem}>
                <div className={styles.smallIcon}>
                  <Video size={18} />
                </div>

                <div>
                  <h4>No live sessions yet</h4>
                  <p>Create your first live session.</p>
                  <span>—</span>
                </div>
              </div>
            )}

            {!sessionsLoading &&
              sessions.map((item) => (
                <div className={styles.sessionItem} key={item.id}>
                  <div className={styles.smallIcon}>
                    <Video size={18} />
                  </div>

                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                    <span>{formatDate(item.scheduled_at)}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default InstructorDashboardDashboard;