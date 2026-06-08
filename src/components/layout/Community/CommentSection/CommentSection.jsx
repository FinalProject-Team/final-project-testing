import { useState } from "react";
import styles from "./CommentSection.module.css";
import { usePosts } from "../../../../context/PostsContext";
import { useAuth } from "../../../../context/AuthContext";
import { BsHeart, BsHeartFill, BsSend } from "react-icons/bs";

export default function CommentSection({ postId, commentList = [] }) {
  const { addComment } = usePosts();
  const { user }       = useAuth();
  const [text, setText] = useState("");
  const [localLikes, setLocalLikes] = useState({});

  function handleSend() {
    if (!text.trim()) return;
    addComment(postId, text, user);
    setText("");
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  function toggleCommentLike(id) {
    setLocalLikes((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className={styles.section}>
      {/* Comment list */}
      {commentList.length > 0 && (
        <div className={styles.list}>
          {commentList.map((c) => (
            <div key={c.id} className={styles.comment}>
              <img src={c.author.avatar} alt={c.author.name} className={styles.cAvatar} />
              <div className={styles.cBody}>
                <div className={styles.cHeader}>
                  <span className={styles.cName}>{c.author.name}</span>
                  <span className={styles.cRole}>{c.author.role}</span>
                  <span className={styles.cTime}>{c.timeAgo}</span>
                </div>
                <p className={styles.cText}>{c.text}</p>
                <button
                  className={`${styles.cLike} ${localLikes[c.id] ? styles.cLiked : ""}`}
                  onClick={() => toggleCommentLike(c.id)}
                >
                  {localLikes[c.id] ? <BsHeartFill size={11} /> : <BsHeart size={11} />}
                  {c.likes + (localLikes[c.id] ? 1 : 0)}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className={styles.inputRow}>
        <img src={user?.avatar} alt={user?.name} className={styles.myAvatar} />
        <div className={styles.inputWrap}>
          <textarea
            className={styles.input}
            placeholder="Write a comment…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
          />
          <button
            className={styles.sendBtn}
            onClick={handleSend}
            disabled={!text.trim()}
            aria-label="Send comment"
          >
            <BsSend size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
