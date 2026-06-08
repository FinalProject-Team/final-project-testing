import { useCallback } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({ value, onChange, placeholder = 'Search projects...' }) {
  const handleChange = useCallback(e => onChange(e.target.value), [onChange]);
  const handleClear = useCallback(() => onChange(''), [onChange]);

  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>⌕</span>
      <input
        type="text"
        className={styles.input}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        spellCheck={false}
      />
      {value && (
        <button className={styles.clear} onClick={handleClear} aria-label="Clear">
          ×
        </button>
      )}
    </div>
  );
}
