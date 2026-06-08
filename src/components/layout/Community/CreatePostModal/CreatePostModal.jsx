import { useState, useRef } from "react";
import styles from "./CreatePostModal.module.css";
import { usePosts } from "../../../../context/PostsContext";
import { useAuth } from "../../../../context/AuthContext";
import { BsImage, BsCode, BsFileEarmarkText, BsX, BsXLg } from "react-icons/bs";

const POST_TYPES  = ["Discussion", "Showcase", "Article", "Job"];
const MAX_CONTENT = 1000;

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

  const [type, setType]           = useState("Discussion");
  const [content, setContent]     = useState("");
  const [tagInput, setTagInput]   = useState("");
  const [tags, setTags]           = useState([]);
  const [imageUrl, setImageUrl]   = useState("");
  const [error, setError]         = useState("");
  const [submitting, setSubmitting] = useState(false);
  const textRef = useRef(null);

  function addTag(e) {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const t = tagInput.trim().replace(/^#?/, "#");
      if (!tags.includes(t) && tags.length < 5) setTags((prev) => [...prev, t]);
      setTagInput("");
    }
  }

  function removeTag(t) { setTags((prev) => prev.filter((x) => x !== t)); }

  async function handleSubmit() {
    if (!content.trim()) { setError("Post content cannot be empty."); textRef.current?.focus(); return; }
    if (content.length > MAX_CONTENT) { setError(`Content must be under ${MAX_CONTENT} characters.`); return; }
    setError("");
    setSubmitting(true);
    // TODO: Call postService.createPost and get real id/timestamp from backend
    addPost({ type, content: content.trim(), tags, image: imageUrl || null }, user);
    setSubmitting(false);
    onClose();
  }

  return (
    <Overlay onClose={onClose}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <img src={user?.avatar} alt={user?.name} className={styles.avatar} />
            <div>
              <div className={styles.userName}>{user?.name}</div>
              <div className={styles.userRole}>{user?.role}</div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close"><BsXLg size={14} /></button>
        </div>

        <div className={styles.typeRow}>
          {POST_TYPES.map((t) => (
            <button key={t} className={`${styles.typeBtn} ${type === t ? styles.typeBtnActive : ""}`} onClick={() => setType(t)}>
              {t}
            </button>
          ))}
        </div>

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

        {(type === "Showcase" || type === "Article") && (
          <input
            className={styles.imageInput}
            placeholder="Paste image URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        )}

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

        <div className={styles.footer}>
          <div className={styles.footerIcons}>
            <button className={styles.iconBtn} title="Add image"><BsImage size={15} /></button>
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
