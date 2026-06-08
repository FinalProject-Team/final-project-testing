import { useMemo, useState } from "react";
import { Plus, Search, Edit, Trash2, ExternalLink, X } from "lucide-react";
import styles from "./InstructorDashboardInteractiveSessions.module.css";

function InstructorDashboardInteractiveSessions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [sessions, setSessions] = useState([
    {
      id: 1,
      title: "Q&A Session - React Hooks",
      course: "React Masterclass",
      description: "Interactive Q&A session covering React Hooks.",
      meetingLink: "https://meet.google.com/react-hooks",
      scheduledAt: "May 29, 3:00 PM",
      status: "Upcoming",
    },
    {
      id: 2,
      title: "Live Coding: Build a Dashboard",
      course: "Web Development Bootcamp",
      description: "Build a complete dashboard from scratch.",
      meetingLink: "https://meet.google.com/dashboard",
      scheduledAt: "May 30, 10:00 AM",
      status: "Live",
    },
    {
      id: 3,
      title: "CSS Grid Workshop",
      course: "Advanced CSS",
      description: "Master CSS Grid layout system.",
      meetingLink: "https://meet.google.com/css-grid",
      scheduledAt: "May 31, 2:00 PM",
      status: "Ended",
    },
  ]);

  const [formData, setFormData] = useState({
    course: "",
    title: "",
    description: "",
    meetingLink: "",
    scheduledAt: "",
    status: "Upcoming",
  });

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const searchValue = searchTerm.toLowerCase();

      return (
        session.title.toLowerCase().includes(searchValue) ||
        session.course.toLowerCase().includes(searchValue) ||
        session.status.toLowerCase().includes(searchValue)
      );
    });
  }, [sessions, searchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateSession = (e) => {
    e.preventDefault();

    const newSession = {
      id: Date.now(),
      ...formData,
    };

    setSessions((prev) => [newSession, ...prev]);

    setFormData({
      course: "",
      title: "",
      description: "",
      meetingLink: "",
      scheduledAt: "",
      status: "Upcoming",
    });

    setIsModalOpen(false);
  };

  const handleDeleteSession = (sessionId) => {
    setSessions((prev) => prev.filter((session) => session.id !== sessionId));
  };

  return (
    <section className={styles.sessions}>
      <div className={styles.header}>
        <div>
          <h1>Interactive Sessions Management</h1>
          <p>Schedule and manage interactive sessions.</p>
        </div>

        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Create Session
        </button>
      </div>

      <div className={styles.searchBox}>
        <Search size={20} />
        <input
          type="text"
          placeholder="Search sessions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Session Title</th>
              <th>Course</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Meeting</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSessions.map((session) => (
              <tr key={session.id}>
                <td>
                  <strong>{session.title}</strong>
                  <span>{session.description}</span>
                </td>

                <td>{session.course}</td>
                <td>{session.scheduledAt}</td>

                <td>
                  <span
                    className={`${styles.status} ${
                      styles[session.status.toLowerCase()]
                    }`}
                  >
                    {session.status}
                  </span>
                </td>

                <td>
                  <a
                    href={session.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.meetingLink}
                  >
                    <ExternalLink size={16} />
                    Join
                  </a>
                </td>

                <td>
                  <div className={styles.actions}>
                    <button>
                      <Edit size={17} />
                    </button>

                    <button onClick={() => handleDeleteSession(session.id)}>
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button
              className={styles.closeBtn}
              onClick={() => setIsModalOpen(false)}
            >
              <X size={22} />
            </button>

            <h2>Create Interactive Session</h2>
            <p>Schedule a new interactive session for your students.</p>

            <form onSubmit={handleCreateSession} className={styles.form}>
              <label>Course</label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
              >
                <option value="">Select a course</option>
                <option value="React Masterclass">React Masterclass</option>
                <option value="Web Development Bootcamp">
                  Web Development Bootcamp
                </option>
                <option value="Advanced CSS">Advanced CSS</option>
              </select>

              <label>Session Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter session title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <label>Description</label>
              <textarea
                name="description"
                placeholder="Describe what this session will cover"
                value={formData.description}
                onChange={handleChange}
                required
              />

              <label>Meeting Link</label>
              <input
                type="url"
                name="meetingLink"
                placeholder="https://meet.google.com/..."
                value={formData.meetingLink}
                onChange={handleChange}
                required
              />

              <label>Scheduled Date & Time</label>
              <input
                type="datetime-local"
                name="scheduledAt"
                value={formData.scheduledAt}
                onChange={handleChange}
                required
              />

              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Live">Live</option>
                <option value="Ended">Ended</option>
              </select>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>

                <button type="submit" className={styles.submitBtn}>
                  Create Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default InstructorDashboardInteractiveSessions;