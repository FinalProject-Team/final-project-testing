import { useState, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SecureBadges from '../SecureBadges/SecureBadges';
import { formatCardNumber, formatExpiry } from '../../../utils/paymob';
import styles from './PaymentForm.module.css';

const InputField = ({ label, id, error, children }) => (
  <div className={styles.fieldGroup}>
    <label className={styles.label} htmlFor={id}>{label}</label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          className={styles.errorMsg}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const PaymentForm = forwardRef(function PaymentForm({ onSubmit, loading, errors = {} }, ref) {
  const [form, setForm] = useState({
    cardNumber: '',
    cardholderName: '',
    expiry: '',
    cvv: '',
  });
  const [focused, setFocused] = useState(null);
  const [showCvv, setShowCvv] = useState(false);

  // Expose triggerSubmit to parent via ref
  useImperativeHandle(ref, () => ({
    triggerSubmit: () => onSubmit(form),
  }));

  const handleChange = (field) => (e) => {
    let val = e.target.value;
    if (field === 'cardNumber') val = formatCardNumber(val);
    if (field === 'expiry') val = formatExpiry(val);
    if (field === 'cvv') val = val.replace(/\D/g, '').slice(0, 4);
    setForm(prev => ({ ...prev, [field]: val }));
  };

  const getCardBrand = () => {
    const raw = form.cardNumber.replace(/\s/g, '');
    if (raw.startsWith('4')) return 'VISA';
    if (/^(5[1-5]|2[2-7])/.test(raw)) return 'MC';
    if (/^3[47]/.test(raw)) return 'AMEX';
    return null;
  };
  const cardBrand = getCardBrand();

  return (
    <motion.div
      className={styles.root}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Header */}
      <div className={styles.methodHeader}>
        <span className={styles.methodTitle}>Payment Method</span>
      </div>

      {/* Card-only tab */}
      <div className={styles.tabs}>
        <div className={`${styles.tab} ${styles.tabActive}`}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          Card
        </div>
      </div>

      {/* Form fields */}
      <div className={styles.form}>

        {/* Card Number */}
        <InputField label="CARD NUMBER" id="cardNumber" error={errors.cardNumber}>
          <div className={`${styles.inputWrapper} ${focused === 'cardNumber' ? styles.inputFocused : ''} ${errors.cardNumber ? styles.inputError : ''}`}>
            <svg className={styles.inputIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            <input
              id="cardNumber"
              className={styles.input}
              style={{ paddingLeft: '40px' }}
              type="text"
              inputMode="numeric"
              value={form.cardNumber}
              onChange={handleChange('cardNumber')}
              onFocus={() => setFocused('cardNumber')}
              onBlur={() => setFocused(null)}
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              autoComplete="cc-number"
            />
            {cardBrand && <span className={styles.cardBrand}>{cardBrand}</span>}
          </div>
        </InputField>

        {/* Cardholder Name */}
        <InputField label="CARDHOLDER NAME" id="cardholderName" error={errors.cardholderName}>
          <div className={`${styles.inputWrapper} ${focused === 'cardholderName' ? styles.inputFocused : ''} ${errors.cardholderName ? styles.inputError : ''}`}>
            <input
              id="cardholderName"
              className={styles.input}
              type="text"
              value={form.cardholderName}
              onChange={handleChange('cardholderName')}
              onFocus={() => setFocused('cardholderName')}
              onBlur={() => setFocused(null)}
              placeholder="Alex Johnson"
              autoComplete="cc-name"
            />
          </div>
        </InputField>

        {/* Expiry + CVV */}
        <div className={styles.twoCol}>
          <InputField label="EXPIRY" id="expiry" error={errors.expiry}>
            <div className={`${styles.inputWrapper} ${focused === 'expiry' ? styles.inputFocused : ''} ${errors.expiry ? styles.inputError : ''}`}>
              <input
                id="expiry"
                className={styles.input}
                type="text"
                inputMode="numeric"
                value={form.expiry}
                onChange={handleChange('expiry')}
                onFocus={() => setFocused('expiry')}
                onBlur={() => setFocused(null)}
                placeholder="MM / YY"
                maxLength={5}
                autoComplete="cc-exp"
              />
            </div>
          </InputField>

          <InputField label="CVV" id="cvv" error={errors.cvv}>
            <div className={`${styles.inputWrapper} ${focused === 'cvv' ? styles.inputFocused : ''} ${errors.cvv ? styles.inputError : ''}`}>
              <input
                id="cvv"
                className={styles.input}
                type={showCvv ? 'text' : 'password'}
                inputMode="numeric"
                value={form.cvv}
                onChange={handleChange('cvv')}
                onFocus={() => setFocused('cvv')}
                onBlur={() => setFocused(null)}
                placeholder="•••"
                maxLength={4}
                autoComplete="cc-csc"
              />
              <button
                className={styles.cvvToggle}
                type="button"
                onClick={() => setShowCvv(v => !v)}
                tabIndex={-1}
                aria-label={showCvv ? 'Hide CVV' : 'Show CVV'}
              >
                {showCvv ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </InputField>
        </div>
      </div>

      {/* Secure badges */}
      <div className={styles.badges}>
        <SecureBadges />
      </div>
    </motion.div>
  );
});

export default PaymentForm;
