import React from 'react';
import { Mic, Send } from 'lucide-react';
import styles from './ChatInput.module.css';

export default function ChatInput({ value, onChange, onSend, disabled }) {
  const textareaRef = React.useRef(null);

  React.useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  }, [value]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend && onSend(value);
    }
  };

  return (
    <div className={styles.inputWrapper}>
      <textarea
        ref={textareaRef}
        className={styles.input}
        placeholder="Ask your AI career advisor anything..."
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        onKeyDown={handleKey}
        rows={1}
        disabled={disabled}
      />
      <button className={styles.iconBtn} title="Voice input" disabled={disabled}>
        <Mic size={16} />
      </button>
      <button className={styles.sendBtn} title="Send" onClick={() => onSend && onSend(value)} disabled={disabled}>
        <Send size={15} />
      </button>
    </div>
  );
}
