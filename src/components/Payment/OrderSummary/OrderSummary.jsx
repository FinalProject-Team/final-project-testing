import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PaymentButton from '../../Payment/PaymentButton/PaymentButton';
import styles from './OrderSummary.module.css';

const VALID_CODES = { CAREER50: 50, START20: 20 };

export default function OrderSummary({ onPay, loading, course }) {
  const [discountCode, setDiscountCode] = useState('CAREER50');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [codeStatus, setCodeStatus] = useState('idle'); // idle | applied | invalid
  const originalPrice = course?.price ?? 699;
  const courseTitle = course?.courseTitle ?? course?.title ?? 'Backend Development';
  const total = Math.max(0, originalPrice - appliedDiscount);

  const handleApply = () => {
    const code = discountCode.trim().toUpperCase();
    if (VALID_CODES[code] !== undefined) {
      const off = Math.round(originalPrice * (VALID_CODES[code] / 100));
      setAppliedDiscount(off);
      setCodeStatus('applied');
    } else {
      setCodeStatus('invalid');
    }
    setTimeout(() => setCodeStatus('idle'), 3000);
  };

  return (
    <div className={styles.root}>
      <h3 className={styles.title}>Order Summary</h3>

      {/* Product */}
      <div className={styles.product}>
        <div className={styles.productThumb}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        </div>
          <div className={styles.productInfo}>
          <p className={styles.productName}>{courseTitle}</p>
          <p className={styles.productMeta}>7 months · 6 courses</p>
          <div className={styles.stars}>
            {[1,2,3,4,5].map(i => (
              <svg key={i} className={`${styles.star} ${i <= 4 ? styles.starFilled : styles.starHalf}`} width="12" height="12" viewBox="0 0 24 24" fill={i <= 4 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
            <span className={styles.rating}>4.8</span>
          </div>
        </div>
      </div>

      {/* Discount */}
      <div className={styles.discountSection}>
        <p className={styles.discountLabel}>DISCOUNT CODE</p>
        <div className={styles.discountRow}>
          <div className={styles.inputWrapper}>
            <svg className={styles.tagIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
            <input
              className={styles.codeInput}
              value={discountCode}
              onChange={e => setDiscountCode(e.target.value.toUpperCase())}
              placeholder="Enter code"
              maxLength={16}
            />
          </div>
          <button className={styles.applyBtn} onClick={handleApply}>Apply</button>
        </div>
        <AnimatePresence>
          {codeStatus === 'applied' && (
            <motion.p className={styles.codeMsg} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              ✓ Code applied!
            </motion.p>
          )}
          {codeStatus === 'invalid' && (
            <motion.p className={`${styles.codeMsg} ${styles.codeMsgError}`} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              ✗ Invalid code
            </motion.p>
          )}
          {codeStatus === 'idle' && (
            <motion.p className={styles.codeSuggestion} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Try: CAREER50 or START20
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Pricing */}
      <div className={styles.pricing}>
        <div className={styles.priceRow}>
          <span className={styles.priceLabel}>Original price</span>
          <span className={styles.priceOriginal}>${originalPrice}</span>
        </div>
        <div className={styles.priceRow}>
          <span className={styles.priceLabel}>Platform discount</span>
          <span className={styles.priceDiscount}>-${appliedDiscount}</span>
        </div>
        <div className={styles.divider} />
        <div className={`${styles.priceRow} ${styles.totalRow}`}>
          <span className={styles.totalLabel}>Total</span>
          <motion.span
            className={styles.totalValue}
            key={total}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            ${total}
          </motion.span>
        </div>
      </div>

      {/* CTA */}
      <div className={styles.ctaWrap}>
        <PaymentButton loading={loading} onClick={onPay}>
          Continue ${total}
        </PaymentButton>
      </div>

      {/* Benefits */}
      <ul className={styles.benefits}>
        {['Lifetime access', 'Certificate of completion', '30-day money back guarantee'].map(b => (
          <li key={b} className={styles.benefit}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
