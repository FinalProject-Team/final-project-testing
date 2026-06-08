import { Zap, RefreshCw } from 'lucide-react';
import styles from './ChatHeader.module.css';

export default function ChatHeader({ onClear }) {
  return (
    <div className={styles.chatHeader}>
      <div className={styles.left}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatarBg}>
            <Zap size={18} />
          </div>
          <span className={styles.onlineDot} />
        </div>
        <div className={styles.info}>
          <div className={styles.name}>Career AI</div>
          <div className={styles.status}>
            <span className={styles.statusDot} />
            Online · Powered by Groq
          </div>
        </div>
      </div>

      {onClear && (
        <button
          className={styles.clearBtn}
          onClick={onClear}
          title="Clear conversation"
          aria-label="Clear conversation"
        >
          <RefreshCw size={15} />
          <span>Clear</span>
        </button>
      )}
    </div>
  );
}
