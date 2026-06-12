import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getApplications,
  acceptApplication,
  rejectApplication,
} from "../../services/api/applications.js";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await getApplications(token);
        setApplications(data || []);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleAccept = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await acceptApplication(id, token);

      // chat is created only on acceptance — store chat_id from response
      const chatId = res?.chat?.id || res?.chatId || null;

      setApplications((prev) =>
        prev.map((app) =>
          app.id === id
            ? { ...app, status: "accepted", chat_id: chatId }
            : app
        )
      );
    } catch (err) {
      console.error("Failed to accept application:", err);
      alert("Failed to accept application. Please try again.");
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await rejectApplication(id, token);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: "rejected" } : app
        )
      );
    } catch (err) {
      console.error("Failed to reject application:", err);
      alert("Failed to reject application. Please try again.");
    }
  };

  const openChat = (chatId) => {
    if (!chatId) {
      alert("Chat ID not found.");
      return;
    }
    navigate(`/dashboard/chat/${chatId}`);
  };

  if (loading) {
    return (
      <div style={styles.wrapper}>
        <h2 style={styles.title}>Applications</h2>
        <p style={styles.muted}>Loading…</p>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Applications</h2>

      {applications.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.muted}>No applications yet.</p>
        </div>
      ) : (
        <div style={styles.list}>
          {applications.map((app) => (
            <div key={app.id} style={styles.card}>
              {/* Cover letter */}
              <p style={styles.cardText}>
                <b>Cover Letter:</b>{" "}
                <span style={{ color: "#cbd5e1" }}>{app.cover_letter || "—"}</span>
              </p>

              {/* Applicant (if available) */}
              {app.applicant_name && (
                <p style={styles.cardText}>
                  <b>Applicant:</b>{" "}
                  <span style={{ color: "#cbd5e1" }}>{app.applicant_name}</span>
                </p>
              )}

              {/* Status badge */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
                <span
                  style={{
                    ...styles.statusBadge,
                    ...(app.status === "accepted"
                      ? styles.statusAccepted
                      : app.status === "rejected"
                      ? styles.statusRejected
                      : styles.statusPending),
                  }}
                >
                  {app.status === "accepted" ? "✔ Accepted" :
                   app.status === "rejected" ? "✖ Rejected" : "⏳ Pending"}
                </span>

                {/* Action buttons */}
                {app.status === "pending" && (
                  <>
                    <button
                      style={{ ...styles.btn, ...styles.btnAccept }}
                      onClick={() => handleAccept(app.id)}
                    >
                      Accept
                    </button>
                    <button
                      style={{ ...styles.btn, ...styles.btnReject }}
                      onClick={() => handleReject(app.id)}
                    >
                      Reject
                    </button>
                  </>
                )}

                {/* Open chat when accepted */}
                {app.status === "accepted" && app.chat_id && (
                  <button
                    style={{ ...styles.btn, ...styles.btnChat }}
                    onClick={() => openChat(app.chat_id)}
                  >
                    💬 Open Chat
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    maxWidth: "720px",
    margin: "0 auto",
    padding: "24px 16px",
    color: "#e2e8f0",
  },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#f1f5f9",
    marginBottom: "20px",
  },
  muted: {
    color: "#64748b",
  },
  empty: {
    textAlign: "center",
    paddingTop: "40px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  card: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "16px 18px",
  },
  cardText: {
    margin: "0 0 6px",
    fontSize: "14px",
    color: "#94a3b8",
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  statusPending: {
    background: "rgba(251,191,36,0.1)",
    color: "#fbbf24",
    border: "1px solid rgba(251,191,36,0.25)",
  },
  statusAccepted: {
    background: "rgba(52,211,153,0.1)",
    color: "#34d399",
    border: "1px solid rgba(52,211,153,0.25)",
  },
  statusRejected: {
    background: "rgba(248,113,113,0.1)",
    color: "#f87171",
    border: "1px solid rgba(248,113,113,0.25)",
  },
  btn: {
    padding: "6px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    border: "none",
    transition: "opacity 0.2s",
  },
  btnAccept: {
    background: "rgba(52,211,153,0.15)",
    color: "#34d399",
    border: "1px solid rgba(52,211,153,0.3)",
  },
  btnReject: {
    background: "rgba(248,113,113,0.1)",
    color: "#f87171",
    border: "1px solid rgba(248,113,113,0.3)",
  },
  btnChat: {
    background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
    color: "#fff",
  },
};
