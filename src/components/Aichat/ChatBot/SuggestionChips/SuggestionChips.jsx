import styles from './SuggestionChips.module.css';

const chips = [
  'What should I learn after React?',
  'How do I prepare for a frontend interview?',
  'What projects should I add to my portfolio?',
  'Explain closures in JavaScript',
];

export default function SuggestionChips({ onSelect }) {
  return (
    <div className={styles.chipsRow}>
      {chips.map((chip) => (
        <button key={chip} className={styles.chip} onClick={() => onSelect && onSelect(chip)}>
          {chip}
        </button>
      ))}
    </div>
  );
}
