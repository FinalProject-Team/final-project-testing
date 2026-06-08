import { useState, useRef, useEffect } from "react";
import styles from "./CreatePostModal.module.css";
import { usePosts } from "../../../context/PostsContext";
import { useAuth } from "../../../context/communityAuth";
import { BsImage, BsBarChart, BsCode, BsFileEarmarkText, BsX, BsXLg } from "react-icons/bs";

const POST_TYPES = ["Discussion", "Showcase", "Article", "Job"];
const MAX_CONTENT = 1000;

// Backdrop overlay that closes on outside click
function Overlay({ onClose, children }) {
  return (
    <div className={styles.backdrop} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {children}
    </div>
  );
}

export default function CreatePostModal({ onClose }) {
  const { addPost } = usePosts();
  const { user }    = useAuth();

  const [type, setType]       = useState("Discussion");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags]       = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError]     = useState("");
  const [submitting, setSubmitting] = useState(false);
  const textRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    function handler(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  function addTag(e) {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const t = tagInput.trim().replace(/^#?/, "#");
      if (!tags.includes(t) && tags.length < 5) setTags((prev) => [...prev, t]);
      setTagInput("");
    }
  }

  function removeTag(t) { setTags((prev) => prev.filter((x) => x !== t)); }

  function handleSubmit() {
    if (!content.trim()) { setError("Post content cannot be empty."); textRef.current?.focus(); return; }
    if (content.length > MAX_CONTENT) { setError(`Content must be under ${MAX_CONTENT} characters.`); return; }
    setError("");
    setSubmitting(true);
    try {
      // TODO: Call postService.createPost and get real id/timestamp from backend
      addPost({ type, content: content.trim(), tags, image: imageUrl || null }, user);
      onClose();
    } catch (err) {
      setError("Failed to post. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <Overlay onClose={onClose}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=user`} alt={user?.name || "User"} className={styles.avatar} />
            <div>
              <div className={styles.userName}>{user?.name}</div>
              <div className={styles.userRole}>{user?.role}</div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close"><BsXLg size={14} /></button>
        </div>

        {/* Type selector */}
        <div className={styles.typeRow}>
          {POST_TYPES.map((t) => (
            <button key={t} className={`${styles.typeBtn} ${type === t ? styles.typeBtnActive : ""}`} onClick={() => setType(t)}>
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <textarea
          ref={textRef}
          className={styles.textarea}
          placeholder="What's on your mind? Share your thoughts, projects, or questions..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={MAX_CONTENT}
          rows={5}
          autoFocus
        />
        <div className={styles.charCount}>{content.length}/{MAX_CONTENT}</div>

        {/* Image URL (Showcase) */}
        {(type === "Showcase" || type === "Article") && (
          <input
            className={styles.imageInput}
            placeholder="Paste image URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        )}

        {/* Tags */}
        <div className={styles.tagWrap}>
          <div className={styles.tags}>
            {tags.map((t) => (
              <span key={t} className={styles.tag}>
                {t} <button onClick={() => removeTag(t)} className={styles.tagRemove}><BsX size={10} /></button>
              </span>
            ))}
          </div>
          <input
            className={styles.tagInput}
            placeholder="Add tags (press Enter)..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
          />
        </div>

        {error && <p className={styles.error}>⚠ {error}</p>}

        {/* Footer actions */}
        <div className={styles.footer}>
          <div className={styles.footerIcons}>
            <button className={styles.iconBtn} title="Add image"><BsImage size={15} /></button>
            <button className={styles.iconBtn} title="Add poll"><BsBarChart size={15} /></button>
            <button className={styles.iconBtn} title="Add code"><BsCode size={15} /></button>
            <button className={styles.iconBtn} title="Add article"><BsFileEarmarkText size={15} /></button>
          </div>
          <div className={styles.footerRight}>
            <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button className={styles.submitBtn} onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Posting…" : "Post"}
            </button>
          </div>
        </div>
      </div>
    </Overlay>
  );
}
