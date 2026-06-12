import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://final-project-backend-production-214a.up.railway.app";

export default function ChatPage() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  // Resolve current user id from multiple possible sources
  const myId =
    user?.id ||
    user?.sub ||
    (() => {
      try {
        const stored = localStorage.getItem("user");
        if (stored) return JSON.parse(stored)?.id;
      } catch {}
      return null;
    })();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch messages with polling
  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/chats/${chatId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        const msgs = Array.isArray(data) ? data : data.messages || [];
        setMessages(msgs);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    const text = newMessage.trim();
    if (!text || sending) return;

    setSending(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/chats/${chatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (ts) => {
    if (!ts) return "";
    try {
      return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerAvatar}>💬</div>
        <div>
          <div style={styles.headerTitle}>Chat</div>
          <div style={styles.headerSub}>ID: {chatId}</div>
        </div>
      </div>

      {/* Messages area */}
      <div style={styles.messagesArea}>
        {messages.length === 0 && (
          <div style={styles.emptyState}>No messages yet. Say hello! 👋</div>
        )}

        {Array.isArray(messages) &&
          messages.map((msg, idx) => {
            const isMe = msg.sender_id === myId;
            return (
              <div
                key={msg.id || idx}
                style={{
                  ...styles.messageRow,
                  justifyContent: isMe ? "flex-end" : "flex-start",
                }}
              >
                {!isMe && (
                  <div style={styles.avatarSmall}>
                    {(msg.sender_name?.[0] || "?").toUpperCase()}
                  </div>
                )}
                <div>
                  <div
                    style={{
                      ...styles.bubble,
                      background: isMe
                        ? "linear-gradient(135deg, #0ea5e9, #2563eb)"
                        : "rgba(255,255,255,0.07)",
                      color: isMe ? "#ffffff" : "#e2e8f0",
                      borderRadius: isMe
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                      border: isMe ? "none" : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {msg.message || msg.content}
                  </div>
                  <div
                    style={{
                      ...styles.timestamp,
                      textAlign: isMe ? "right" : "left",
                    }}
                  >
                    {formatTime(msg.created_at || msg.timestamp)}
                  </div>
                </div>
                {isMe && (
                  <div
                    style={{
                      ...styles.avatarSmall,
                      background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
                    }}
                  >
                    {(user?.email?.[0] || "M").toUpperCase()}
                  </div>
                )}
              </div>
            );
          })}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div style={styles.inputArea}>
        <input
          type="text"
          value={newMessage}
          placeholder="Type a message…"
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          style={styles.input}
        />
        <button
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || sending}
          style={{
            ...styles.sendBtn,
            opacity: !newMessage.trim() || sending ? 0.5 : 1,
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 60px)",
    maxWidth: "760px",
    margin: "0 auto",
    background: "#0b1220",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.07)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 20px",
    background: "rgba(255,255,255,0.04)",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },
  headerAvatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },
  headerTitle: {
    color: "#f1f5f9",
    fontWeight: "600",
    fontSize: "15px",
  },
  headerSub: {
    color: "#64748b",
    fontSize: "12px",
  },
  messagesArea: {
    flex: 1,
    overflowY: "auto",
    padding: "20px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  emptyState: {
    textAlign: "center",
    color: "#475569",
    marginTop: "60px",
    fontSize: "14px",
  },
  messageRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: "8px",
  },
  avatarSmall: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "700",
    color: "white",
    flexShrink: 0,
  },
  bubble: {
    padding: "10px 14px",
    maxWidth: "480px",
    wordBreak: "break-word",
    fontSize: "14px",
    lineHeight: "1.5",
    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
  },
  timestamp: {
    fontSize: "11px",
    color: "#475569",
    marginTop: "3px",
    paddingLeft: "2px",
    paddingRight: "2px",
  },
  inputArea: {
    display: "flex",
    gap: "10px",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.03)",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: "11px 16px",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#f1f5f9",
    fontSize: "14px",
    outline: "none",
  },
  sendBtn: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
    border: "none",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "opacity 0.2s",
  },
};
