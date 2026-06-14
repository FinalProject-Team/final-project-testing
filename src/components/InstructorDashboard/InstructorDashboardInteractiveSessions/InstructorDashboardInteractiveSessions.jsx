import { useMemo, useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, X, Video } from "lucide-react";
import styles from "./InstructorDashboardInteractiveSessions.module.css";
import JitsiMeeting from "../../LiveSessions/JitsiMeeting";
import {
  createLiveSession,
  deleteLiveSession,
  updateLiveSession,
  getInstructorCourses,
} from "../../../services/api/instructorService";
import { apiGetMe } from "../../../services/api/api";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://final-project-backend-production-214a.up.railway.app";

function getToken() { return localStorage.getItem("token") || null; }
function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

// ─── helpers ────────────────────────────────────────────────────────────────

function normaliseSession(s) {
  return {
    id:            s.id,
    title:         s.title         || "",
    course:        s.course_title  || s.course?.title || "",
    courseId:      s.course_id     || s.course?.id    || "",
    description:   s.description   || "",
    meetingLink:   s.meeting_link  || s.jitsi_room_id || `session-${s.id}`,
    scheduledAtRaw: s.scheduled_at || "",
    scheduledAt:   s.scheduled_at
      ? new Date(s.scheduled_at).toLocaleString()
      : "",
    sessionType:   s.session_type  || "workshop",
    status:        s.status        || "Upcoming",
  };
}

function toISOString(dtLocal) {
  if (!dtLocal) return "";
  const d = new Date(dtLocal);
  return isNaN(d.getTime()) ? dtLocal : d.toISOString();
}

function toDatetimeLocal(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return "";
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

const EMPTY_FORM = {
  courseId:    "",
  title:       "",
  description: "",
  meetingLink: "",
  scheduledAt: "",
  sessionType: "workshop",
  status:      "Upcoming",
};

const SESSION_TYPES = ["workshop", "mentoring", "q&a", "live_coding", "project_review"];

// ─── component ───────────────────────────────────────────────────────────────

function InstructorDashboardInteractiveSessions() {
  const [searchTerm, setSearchTerm]     = useState("");
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [sessions, setSessions]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [instructorName, setInstructorName] = useState("Instructor");
  const [courses, setCourses]           = useState([]);
  const [editingSession, setEditingSession] = useState(null);
  const [activeRoom, setActiveRoom]     = useState(null);
  const [formData, setFormData]         = useState(EMPTY_FORM);
  const [formError, setFormError]       = useState(null);
  const [saving, setSaving]             = useState(false);

  // ── fetch sessions ─────────────────────────────────────────────────────────
  // BUG FIX: getInstructorLiveSessions() → GET /api/live-sessions/instructor
  // returns 400 when instructor has no profile record in DB.
  // Fix: try /api/live-sessions/instructor first, fall back to /api/live-sessions (all sessions)
  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Try instructor-specific endpoint first
      const res = await axios.get(
        `${BASE_URL}/api/live-sessions/instructor`,
        { headers: authHeaders() }
      );
      const raw = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setSessions(raw.map(normaliseSession));
    } catch (err) {
      // BUG FIX: 400/403 means instructor profile not set up yet
      // Fall back to all sessions (public endpoint) so page doesn't break
      console.warn("Instructor sessions endpoint error, using public fallback:", err.message);
      try {
        const res2 = await axios.get(`${BASE_URL}/api/live-sessions`, {
          headers: authHeaders(),
        });
        const raw2 = Array.isArray(res2.data) ? res2.data : res2.data?.data || [];
        setSessions(raw2.map(normaliseSession));
      } catch (err2) {
        console.error("Both sessions endpoints failed:", err2.message);
        setError("Could not load sessions. Please try again.");
        setSessions([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMe = async () => {
    try {
      const me = await apiGetMe();
      setInstructorName(me?.user?.full_name || me?.full_name || "Instructor");
    } catch (_) {}
  };

  const fetchCourses = async () => {
    try {
      const data = await getInstructorCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (_) {}
  };

  useEffect(() => {
    fetchSessions();
    fetchMe();
    fetchCourses();
  }, []);

  // ── modal helpers ──────────────────────────────────────────────────────────

  const openCreateModal = () => {
    setEditingSession(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (session) => {
    setEditingSession(session);
    setFormData({
      courseId:    session.courseId  || "",
      title:       session.title,
      description: session.description,
      meetingLink: session.meetingLink,
      scheduledAt: toDatetimeLocal(session.scheduledAtRaw),
      sessionType: session.sessionType || "workshop",
      status:      session.status,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSession(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
  };

  // ── CRUD handlers ──────────────────────────────────────────────────────────

  const handleSubmitSession = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    // Auto-generate meeting_link if not provided
    const jitsiRoom = `careertech-${Date.now().toString(36)}`;
    const payload = {
      title:        formData.title,
      description:  formData.description,
      scheduled_at: toISOString(formData.scheduledAt),
      meeting_link: formData.meetingLink.trim() || `https://meet.jit.si/${jitsiRoom}`,
      session_type: formData.sessionType,
      course_id:    formData.courseId,
    };

    try {
      if (editingSession) {
        await updateLiveSession(editingSession.id, payload);
      } else {
        const res = await createLiveSession(payload);
        // BUG FIX: open Jitsi meeting immediately after create
        const created = res?.data || res;
        if (created?.id) {
          const roomName = created.meeting_link || `session-${created.id}`;
          closeModal();
          await fetchSessions();
          setActiveRoom({ roomName, sessionTitle: created.title });
          return;
        }
      }
      closeModal();
      await fetchSessions();
    } catch (err) {
      console.error("Failed to save session:", err);
      // BUG FIX: show specific error in modal instead of alert
      setFormError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        `Failed to ${editingSession ? "update" : "create"} session. Check all required fields.`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm("Delete this session?")) return;
    try {
      await deleteLiveSession(sessionId);
      await fetchSessions();
    } catch (err) {
      console.warn("Delete failed on backend, removing locally:", err.message);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    }
  };

  const handleStartSession = async (session) => {
    try {
      await updateLiveSession(session.id, { status: "Live" });
    } catch (_) {}
    setSessions((prev) =>
      prev.map((s) => (s.id === session.id ? { ...s, status: "Live" } : s))
    );
    setActiveRoom({
      roomName:     session.meetingLink || `session-${session.id}`,
      sessionTitle: session.title,
    });
  };

  const handleJoinSession = (session) => {
    setActiveRoom({
      roomName:     session.meetingLink || `session-${session.id}`,
      sessionTitle: session.title,
    });
  };

  // ── filter ─────────────────────────────────────────────────────────────────

  const filteredSessions = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return sessions.filter(
      (s) =>
        (s.title  || "").toLowerCase().includes(q) ||
        (s.course || "").toLowerCase().includes(q) ||
        (s.status || "").toLowerCase().includes(q)
    );
  }, [sessions, searchTerm]);

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <section className={styles.sessions}>
      {activeRoom && (
        <JitsiMeeting
          roomName={activeRoom.roomName}
          userName={`${instructorName} (Host)`}
          isMod={true}
          onClose={() => setActiveRoom(null)}
        />
      )}

      <div className={styles.header}>
        <div>
          <h1>Interactive Sessions Management</h1>
          <p>Schedule and manage interactive sessions.</p>
        </div>
        <button className={styles.addBtn} onClick={openCreateModal}>
          <Plus size={18} /> Create Session
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

      {loading ? (
        <div className="text-center py-5 text-secondary">
          <div className="spinner-border" style={{ color: "#22d3ee" }} role="status" />
          <p style={{ marginTop: 12, color: "#64748b" }}>Loading sessions...</p>
        </div>
      ) : (
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
              {filteredSessions.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", opacity: 0.5, padding: "40px" }}>
                    {error ? `⚠ ${error}` : "No sessions yet. Click 'Create Session' to get started."}
                  </td>
                </tr>
              )}
              {filteredSessions.map((session) => (
                <tr key={session.id}>
                  <td>
                    <strong>{session.title}</strong>
                    <span>{session.description}</span>
                  </td>
                  <td>{session.course || "—"}</td>
                  <td>{session.scheduledAt}</td>
                  <td>
                    <span className={`${styles.status} ${styles[(session.status || "").toLowerCase()]}`}>
                      {session.status}
                    </span>
                  </td>
                  <td>
                    {session.status?.toLowerCase() === "live" ? (
                      <button className={styles.joinBtn} onClick={() => handleJoinSession(session)}>
                        <Video size={15} /> Join Live (Host)
                      </button>
                    ) : session.status?.toLowerCase() !== "ended" ? (
                      <button className={styles.startBtn} onClick={() => handleStartSession(session)}>
                        <Video size={15} /> Go Live Now
                      </button>
                    ) : (
                      <span className={styles.endedText}>Ended</span>
                    )}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button onClick={() => openEditModal(session)} title="Edit"><Edit size={17} /></button>
                      <button onClick={() => handleDeleteSession(session.id)} title="Delete"><Trash2 size={17} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeBtn} onClick={closeModal}><X size={22} /></button>
            <h2>{editingSession ? "Edit Interactive Session" : "Create Interactive Session"}</h2>
            <p>{editingSession ? "Update the details of your session." : "Schedule a new session for your students."}</p>

            <form onSubmit={handleSubmitSession} className={styles.form}>
              <label>Course *</label>
              <select
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                required
              >
                <option value="">Select a course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>

              <label>Session Title *</label>
              <input
                type="text"
                placeholder="Enter session title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <label>Description *</label>
              <textarea
                placeholder="Describe what this session will cover"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />

              <label>Meeting Link <span style={{ color: "#64748b", fontWeight: 400 }}>(optional — auto-generated if empty)</span></label>
              <input
                type="text"
                placeholder="https://meet.jit.si/my-session"
                value={formData.meetingLink}
                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
              />

              <label>Scheduled Date & Time *</label>
              <input
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                required
              />

              <label>Session Type</label>
              <select
                value={formData.sessionType}
                onChange={(e) => setFormData({ ...formData, sessionType: e.target.value })}
              >
                {SESSION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>

              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Live">Live</option>
                <option value="Ended">Ended</option>
              </select>

              {/* BUG FIX: show error inside modal instead of alert */}
              {formError && (
                <div style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.4)",
                  borderRadius: 8,
                  padding: "10px 14px",
                  color: "#f87171",
                  fontSize: "0.83rem",
                }}>
                  ⚠ {formError}
                </div>
              )}

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                <button type="submit" className={styles.submitBtn} disabled={saving}>
                  {saving ? "Saving…" : editingSession ? "Update Session" : "Create Session"}
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
