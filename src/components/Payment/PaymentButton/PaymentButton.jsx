import { motion } from 'framer-motion';
import styles from './PaymentButton.module.css';

export default function PaymentButton({ loading, children, onClick, disabled }) {
  return (
    <motion.button
      className={styles.root}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.015, y: -1 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.985 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <span className={styles.glowLayer} />
      {loading ? (
        <span className={styles.loaderWrap}>
          <span className={styles.spinner} />
          <span>Processing…</span>
        </span>
      ) : (
        <span className={styles.content}>
          {children}
          <svg className={styles.arrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </span>
      )}
    </motion.button>
  );
}
