import { useState } from 'react';
import { Zap, Copy, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import styles from './ChatMessage.module.css';

/** Minimal markdown renderer — handles **bold**, bullet lists, newlines */
function renderMarkdown(text) {
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Bullet list line
    if (/^[-*•]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*•]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*•]\s+/, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} style={{ margin: '6px 0 6px 16px', padding: 0, lineHeight: 1.7 }}>
          {items.map((item, j) => (
            <li key={j}>{formatInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Empty line → spacer
    if (line.trim() === '') {
      elements.push(<div key={`sp-${i}`} style={{ height: '6px' }} />);
    } else {
      elements.push(<p key={`p-${i}`} style={{ margin: '2px 0', lineHeight: 1.65 }}>{formatInline(line)}</p>);
    }
    i++;
  }
  return elements;
}

function formatInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  );
}

export default function ChatMessage({ text, time }) {
  const [copied, setCopied]   = useState(false);
  const [liked, setLiked]     = useState(null); // 'up' | 'down' | null

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={styles.messageWrap}>
      <div className={styles.avatarWrap}>
        <Zap size={16} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div className={styles.bubble}>
          {renderMarkdown(text)}
        </div>

        <div className={styles.actions}>
          {time && <span style={{ fontSize: '11px', color: 'var(--txt-muted,#6b7280)', marginRight: '6px' }}>{time}</span>}

          <button className={styles.actionBtn} title="Copy" onClick={handleCopy}>
            {copied ? <Check size={13} style={{ color: '#10b981' }} /> : <Copy size={13} />}
          </button>
          <button
            className={`${styles.actionBtn} ${liked === 'up' ? styles.active : ''}`}
            title="Helpful" onClick={() => setLiked(l => l === 'up' ? null : 'up')}
          >
            <ThumbsUp size={13} />
          </button>
          <button
            className={`${styles.actionBtn} ${liked === 'down' ? styles.activeDown : ''}`}
            title="Not helpful" onClick={() => setLiked(l => l === 'down' ? null : 'down')}
          >
            <ThumbsDown size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
