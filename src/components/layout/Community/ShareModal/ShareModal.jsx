import { useState } from "react";
import styles from "./ShareModal.module.css";
import { BsLink45Deg, BsTwitterX, BsLinkedin, BsCheck2 } from "react-icons/bs";
import { BsXLg } from "react-icons/bs";

const SHARE_LINK = "https://careertech.io/post/";

export default function ShareModal({ postId, onClose }) {
  const [copied, setCopied] = useState(false);
  const link = `${SHARE_LINK}${postId}`;

  function copyLink() {
    // TODO: Use navigator.clipboard in production
    navigator.clipboard?.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareTwitter() {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}`, "_blank");
  }

  function shareLinkedIn() {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`, "_blank");
  }

  return (
    <div className={styles.backdrop} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={styles.title}>Share Post</span>
          <button className={styles.closeBtn} onClick={onClose}><BsXLg size={13} /></button>
        </div>

        <div className={styles.linkRow}>
          <input className={styles.linkInput} value={link} readOnly />
          <button className={`${styles.copyBtn} ${copied ? styles.copiedBtn : ""}`} onClick={copyLink}>
            {copied ? <><BsCheck2 size={13} /> Copied!</> : <><BsLink45Deg size={13} /> Copy</>}
          </button>
        </div>

        <div className={styles.socials}>
          <button className={styles.socialBtn} onClick={shareTwitter}>
            <BsTwitterX size={14} /> Share on X
          </button>
          <button className={styles.socialBtn} onClick={shareLinkedIn}>
            <BsLinkedin size={14} /> Share on LinkedIn
          </button>
        </div>
      </div>
    </div>
  );
}
