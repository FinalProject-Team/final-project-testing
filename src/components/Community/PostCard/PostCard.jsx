import { useState, useRef, useEffect } from "react";
import styles from "./PostCard.module.css";
import { usePosts } from "../../../context/PostsContext";
import { useAuth } from "../../../context/communityAuth";
import CommentSection from "../CommentSection/CommentSection";
import ShareModal from "../ShareModal/ShareModal";
import {
  HiOutlineDotsHorizontal, HiOutlineBookmark, HiBookmark,
} from "react-icons/hi";
import { MdOutlineLocationOn, MdOutlineAttachMoney, MdOutlineWorkOutline } from "react-icons/md";
import { BsHeart, BsHeartFill, BsChatSquare, BsShare, BsClock, BsTrash, BsPencil, BsCheck2, BsX } from "react-icons/bs";

const TYPE_CLASS = {
  Discussion: styles.typeDiscussion,
  Showcase:   styles.typeShowcase,
  Poll:       styles.typePoll,
  Article:    styles.typeArticle,
  Job:        styles.typeJob,
};

const MAX_EDIT = 1000;

export default function PostCard({ post }) {
  const { toggleLike, toggleSave, votePoll, deletePost, editPost } = usePosts();
  const { user } = useAuth();

  const [showComments, setShowComments] = useState(false);
  const [showShare,    setShowShare]    = useState(false);
  const [showMenu,     setShowMenu]     = useState(false);
  const menuRef                             = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    if (!showMenu) return;
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  // Edit state
  const [editing,     setEditing]     = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editError,   setEditError]   = useState("");

  const isOwner = user?.id && post.authorId === user.id;

  function startEdit() {
    setEditContent(post.content);
    setEditError("");
    setEditing(true);
    setShowMenu(false);
  }

  function cancelEdit() {
    setEditing(false);
    setEditContent(post.content);
    setEditError("");
  }

  function saveEdit() {
    if (!editContent.trim()) {
      setEditError("Post content cannot be empty.");
      return;
    }
    if (editContent.length > MAX_EDIT) {
      setEditError(`Content must be under ${MAX_EDIT} characters.`);
      return;
    }
    editPost(post.id, { content: editContent, tags: post.tags });
    setEditing(false);
    setEditError("");
  }

  function handleEditKey(e) {
    if (e.key === "Escape") cancelEdit();
    if (e.key === "Enter" && e.ctrlKey) saveEdit();
  }

  return (
    <>
      <article className={styles.postCard}>
        {/* ── Header ── */}
        <div className={styles.postHeader}>
          <img src={post.author.avatar} alt={post.author.name} className={styles.authorAvatar} />
          <div className={styles.authorInfo}>
            <div className={styles.authorRow}>
              <span className={styles.authorName}>{post.author.name}</span>
              {post.author.verified && <span className={styles.verifiedBadge}>✓</span>}
              <span className={`${styles.typeBadge} ${TYPE_CLASS[post.type] || ""}`}>{post.type}</span>
              {post.edited && <span className={styles.editedBadge}>(edited)</span>}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <span className={styles.authorRole}>{post.author.role}</span>
              <span className={styles.postTime}>· {post.timeAgo}</span>
            </div>
          </div>

          {/* ── More menu ── */}
          <div className={styles.menuWrap} ref={menuRef}>
            <button
              className={styles.moreBtn}
              onClick={() => setShowMenu((v) => !v)}
              aria-label="More options"
            >
              <HiOutlineDotsHorizontal />
            </button>
            {showMenu && (
              <div className={styles.dropMenu}>
                <button className={styles.dropItem} onClick={() => { navigator.clipboard?.writeText(`https://careertech.io/post/${post.id}`).catch(()=>{}); setShowMenu(false); }}>Copy link</button>
                <button className={styles.dropItem} onClick={() => setShowMenu(false)}>Report</button>
                {isOwner && (
                  <>
                    <div className={styles.dropDivider} />
                    <button
                      className={styles.dropItem}
                      onClick={startEdit}
                    >
                      <BsPencil size={12} /> Edit
                    </button>
                    <button
                      className={`${styles.dropItem} ${styles.dropDanger}`}
                      onClick={() => { deletePost(post.id); setShowMenu(false); }}
                    >
                      <BsTrash size={12} /> Delete
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Content (normal or edit mode) ── */}
        {editing ? (
          <div className={styles.editWrap}>
            <textarea
              className={styles.editTextarea}
              value={editContent}
              onChange={(e) => { setEditContent(e.target.value); setEditError(""); }}
              onKeyDown={handleEditKey}
              rows={4}
              autoFocus
              maxLength={MAX_EDIT}
            />
            <div className={styles.editMeta}>
              <span className={styles.charCount}>{editContent.length}/{MAX_EDIT}</span>
              <span className={styles.editHint}>Ctrl+Enter to save · Esc to cancel</span>
            </div>
            {editError && <p className={styles.editError}>⚠ {editError}</p>}
            <div className={styles.editActions}>
              <button className={styles.editCancelBtn} onClick={cancelEdit}><BsX size={13} /> Cancel</button>
              <button className={styles.editSaveBtn}   onClick={saveEdit}><BsCheck2 size={13} /> Save</button>
            </div>
          </div>
        ) : (
          <p className={styles.content}>{post.content}</p>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className={styles.tags}>
            {post.tags.map((t) => <span key={t} className={styles.tag}>{t}</span>)}
          </div>
        )}

        {/* Showcase Image */}
        {post.image && <img src={post.image} alt="post visual" className={styles.postImage} loading="lazy" />}

        {/* Article read time */}
        {post.readTime && (
          <span className={styles.readTimeBadge}><BsClock size={11} /> {post.readTime}</span>
        )}

        {/* Job Details */}
        {post.jobDetails && (
          <div className={styles.jobDetails}>
            <span className={styles.jobDetail}><MdOutlineLocationOn /> {post.jobDetails.location}</span>
            <span className={styles.jobDetail}><MdOutlineAttachMoney /> {post.jobDetails.salary}</span>
            <span className={styles.jobDetail}><MdOutlineWorkOutline /> {post.jobDetails.type}</span>
          </div>
        )}

        {/* Poll — interactive voting */}
        {post.poll && (
          <>
            <div className={styles.pollOptions}>
              {post.poll.options.map((opt, i) => (
                <div
                  key={i}
                  className={`${styles.pollOption} ${post.poll.voted !== undefined && post.poll.voted !== null ? styles.pollVoted : ""}`}
                  onClick={() => { if (post.poll.voted === undefined || post.poll.voted === null) votePoll(post.id, i); }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && votePoll(post.id, i)}
                  aria-label={`Vote for ${opt.label}`}
                >
                  <div className={styles.pollBar} style={{ width: `${opt.percent}%` }} />
                  <div className={styles.pollOptionContent}>
                    <span>{opt.label}</span>
                    <span className={styles.pollPercent}>{opt.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
            <p className={styles.pollMeta}>{post.poll.totalVotes} votes{post.poll.voted !== null && post.poll.voted !== undefined ? " · You voted" : ""}</p>
          </>
        )}

        {/* ── Actions ── */}
        <div className={styles.actions}>
          <button
            className={`${styles.actionBtn} ${post.liked ? styles.liked : ""}`}
            onClick={() => toggleLike(post.id)}
            aria-label={post.liked ? "Unlike post" : "Like post"}
          >
            {post.liked ? <BsHeartFill size={13} /> : <BsHeart size={13} />}
            {post.likes}
          </button>

          <button
            className={`${styles.actionBtn} ${showComments ? styles.commentActive : ""}`}
            onClick={() => setShowComments((v) => !v)}
            aria-label="Toggle comments"
          >
            <BsChatSquare size={13} /> {post.comments}
          </button>

          <button className={styles.actionBtn} onClick={() => setShowShare(true)} aria-label="Share post">
            <BsShare size={13} /> Share
          </button>

          <button
            className={`${styles.actionBtn} ${styles.actionSave} ${post.saved ? styles.saved : ""}`}
            onClick={() => toggleSave(post.id)}
            aria-label={post.saved ? "Unsave post" : "Save post"}
          >
            {post.saved ? <HiBookmark size={14} /> : <HiOutlineBookmark size={14} />}
          </button>
        </div>

        {/* ── Comments ── */}
        {showComments && (
          <CommentSection postId={post.id} commentList={post.commentList || []} />
        )}
      </article>

      {/* Share Modal */}
      {showShare && <ShareModal postId={post.id} onClose={() => setShowShare(false)} />}
    </>
  );
}
