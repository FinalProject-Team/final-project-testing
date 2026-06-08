import { useState } from "react";
import styles from "./PostCard.module.css";
import { usePosts } from "../../../../context/PostsContext";
import { useAuth } from "../../../../context/AuthContext";
import CommentSection from "../CommentSection/CommentSection";
import ShareModal from "../ShareModal/ShareModal";
import {
  HiOutlineDotsHorizontal, HiOutlineBookmark, HiBookmark,
} from "react-icons/hi";
import { MdOutlineLocationOn, MdOutlineAttachMoney, MdOutlineWorkOutline } from "react-icons/md";
import { BsHeart, BsHeartFill, BsChatSquare, BsShare, BsClock, BsTrash } from "react-icons/bs";

const TYPE_CLASS = {
  Discussion: styles.typeDiscussion,
  Showcase:   styles.typeShowcase,
  Poll:       styles.typePoll,
  Article:    styles.typeArticle,
  Job:        styles.typeJob,
};

export default function PostCard({ post }) {
  const { toggleLike, toggleSave, votePoll, deletePost } = usePosts();
  const { user } = useAuth();

  const [showComments, setShowComments] = useState(false);
  const [showShare,    setShowShare]    = useState(false);
  const [showMenu,     setShowMenu]     = useState(false);

  const isOwner = user?.id && post.authorId === user.id;

  return (
    <>
      <article className={styles.postCard}>
        {/* Header */}
        <div className={styles.postHeader}>
          <img src={post.author.avatar} alt={post.author.name} className={styles.authorAvatar} />
          <div className={styles.authorInfo}>
            <div className={styles.authorRow}>
              <span className={styles.authorName}>{post.author.name}</span>
              {post.author.verified && <span className={styles.verifiedBadge}>✓</span>}
              <span className={`${styles.typeBadge} ${TYPE_CLASS[post.type] || ""}`}>{post.type}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <span className={styles.authorRole}>{post.author.role}</span>
              <span className={styles.postTime}>· {post.timeAgo}</span>
            </div>
          </div>

          <div className={styles.menuWrap}>
            <button className={styles.moreBtn} onClick={() => setShowMenu((v) => !v)} aria-label="More options">
              <HiOutlineDotsHorizontal />
            </button>
            {showMenu && (
              <div className={styles.dropMenu}>
                <button className={styles.dropItem} onClick={() => setShowMenu(false)}>Copy link</button>
                <button className={styles.dropItem} onClick={() => setShowMenu(false)}>Report</button>
                {isOwner && (
                  <button
                    className={`${styles.dropItem} ${styles.dropDanger}`}
                    onClick={() => { deletePost(post.id); setShowMenu(false); }}
                  >
                    <BsTrash size={12} /> Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <p className={styles.content}>{post.content}</p>

        {post.tags?.length > 0 && (
          <div className={styles.tags}>
            {post.tags.map((t) => <span key={t} className={styles.tag}>{t}</span>)}
          </div>
        )}

        {post.image && <img src={post.image} alt="post visual" className={styles.postImage} loading="lazy" />}

        {post.readTime && (
          <span className={styles.readTimeBadge}><BsClock size={11} /> {post.readTime}</span>
        )}

        {post.jobDetails && (
          <div className={styles.jobDetails}>
            <span className={styles.jobDetail}><MdOutlineLocationOn /> {post.jobDetails.location}</span>
            <span className={styles.jobDetail}><MdOutlineAttachMoney /> {post.jobDetails.salary}</span>
            <span className={styles.jobDetail}><MdOutlineWorkOutline /> {post.jobDetails.type}</span>
          </div>
        )}

        {post.poll && (
          <>
            <div className={styles.pollOptions}>
              {post.poll.options.map((opt, i) => (
                <div
                  key={i}
                  className={`${styles.pollOption} ${post.poll.voted !== undefined && post.poll.voted !== null ? styles.pollVoted : ""}`}
                  onClick={() => { if (post.poll.voted === undefined || post.poll.voted === null) votePoll(post.id, i); }}
                >
                  <div className={styles.pollBar} style={{ width: `${opt.percent}%` }} />
                  <div className={styles.pollOptionContent}>
                    <span>{opt.label}</span>
                    <span className={styles.pollPercent}>{opt.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
            <p className={styles.pollMeta}>
              {post.poll.totalVotes} votes
              {post.poll.voted !== null && post.poll.voted !== undefined ? " · You voted" : ""}
            </p>
          </>
        )}

        <div className={styles.actions}>
          <button
            className={`${styles.actionBtn} ${post.liked ? styles.liked : ""}`}
            onClick={() => toggleLike(post.id)}
          >
            {post.liked ? <BsHeartFill size={13} /> : <BsHeart size={13} />}
            {post.likes}
          </button>
          <button
            className={`${styles.actionBtn} ${showComments ? styles.commentActive : ""}`}
            onClick={() => setShowComments((v) => !v)}
          >
            <BsChatSquare size={13} /> {post.comments}
          </button>
          <button className={styles.actionBtn} onClick={() => setShowShare(true)}>
            <BsShare size={13} /> Share
          </button>
          <button
            className={`${styles.actionBtn} ${styles.actionSave} ${post.saved ? styles.saved : ""}`}
            onClick={() => toggleSave(post.id)}
          >
            {post.saved ? <HiBookmark size={14} /> : <HiOutlineBookmark size={14} />}
          </button>
        </div>

        {showComments && (
          <CommentSection postId={post.id} commentList={post.commentList || []} />
        )}
      </article>

      {showShare && <ShareModal postId={post.id} onClose={() => setShowShare(false)} />}
    </>
  );
}
