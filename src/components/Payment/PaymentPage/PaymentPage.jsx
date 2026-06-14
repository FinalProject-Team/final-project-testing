import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import BackgroundEffects from '../BackgroundEffects/BackgroundEffects';
import PaymentForm from '../PaymentForm/PaymentForm';
import OrderSummary from '../OrderSummary/OrderSummary';
import Toast from '../Toast/Toast';
import { useToast } from '../../../hooks/useToast';
import { useAuth } from '../../../context/AuthContext';
import { validateCardForm } from '../../../utils/paymob';
import { apiEnrollInCourse } from '../../../services/api/api';
import styles from './PaymentPage.module.css';

function Logo() {
  const navigate = useNavigate();
  return (
    <div className={styles.logo} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
      <div className={styles.logoIcon}>✦</div>
      <span className={styles.logoText}>CareerTech</span>
    </div>
  );
}

function BackButton() {
  const navigate = useNavigate();
  return (
    <button className={styles.backBtn} onClick={() => navigate('/')} aria-label="Back to home">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"/>
        <polyline points="12 19 5 12 12 5"/>
      </svg>
      Back
    </button>
  );
}

function SuccessState() {
  const navigate = useNavigate();
  return (
    <motion.div
      className={styles.successRoot}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      <motion.div
        className={styles.successIcon}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </motion.div>
      <h2 className={styles.successTitle}>Enrollment Confirmed!</h2>
      <p className={styles.successSub}>
        Your payment was processed successfully.<br />You now have access to the student dashboard.
      </p>
      <div className={styles.successDetails}>
        <div className={styles.successBadge}>✓ Dashboard access enabled</div>
        <div className={styles.successBadge}>✓ Certificate Pending</div>
      </div>
      <button className={styles.successHomeBtn} onClick={() => navigate('/dashboard/dashboard')}>
        Go to Dashboard
      </button>
      <button className={styles.successHomeBtn} onClick={() => navigate('/')}>
        Return to Home
      </button>
    </motion.div>
  );
}

function PaymobIframe({ url, onClose }) {
  return (
    <motion.div
      className={styles.iframeOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={styles.iframeCard}
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        <div className={styles.iframeHeader}>
          <span className={styles.iframeTitle}>Secure Payment — Powered by Paymob</span>
          <button className={styles.iframeClose} onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <iframe
          src={url}
          className={styles.iframe}
          title="Paymob Secure Payment"
          allow="payment"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </motion.div>
    </motion.div>
  );
}

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [paymentState, setPaymentState] = useState('idle');
  const [iframeUrl, setIframeUrl] = useState(null);
  const [afterPaymentPath, setAfterPaymentPath] = useState(null);
  const [pendingCourse, setPendingCourse] = useState(null);
  const { toasts, toast, removeToast } = useToast();
  const formRef = useRef(null);

  const { markPaid } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedAfter = sessionStorage.getItem('afterPayment');
    if (storedAfter) {
      setAfterPaymentPath(storedAfter);
      sessionStorage.removeItem('afterPayment');
      return;
    }

    if (location.state?.from?.pathname) {
      setAfterPaymentPath(location.state.from.pathname);
    }
    // load pending course saved before login
    try {
      const raw = sessionStorage.getItem('pendingCourse');
      if (raw) {
        const p = JSON.parse(raw);
        setPendingCourse(p);
        sessionStorage.removeItem('pendingCourse');
      } else if (location.state?.courseId) {
        setPendingCourse({ courseId: location.state.courseId, courseTitle: location.state.courseTitle, price: location.state.price });
      }
    } catch (err) {
      // ignore
    }
  }, [location.state]);


const handlePay = async (formData) => {
  const { isValid, errors } = validateCardForm(formData);
  if (!isValid) {
    setFormErrors(errors);
    toast.error('Please fix the highlighted fields before continuing.');
    return;
  }

  setFormErrors({});
  setLoading(true);

  try {
    toast.info('Processing your payment...');

    // Temporary mock payment flow. Replace this block with the Paymob integration
    // when your Paymob API keys and iframe configuration are available.
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (markPaid) {
      await markPaid();
    }

    if (pendingCourse?.courseId) {
      try {
        await apiEnrollInCourse(pendingCourse.courseId);
      } catch (enrollErr) {
        console.warn("Enrollment after payment failed:", enrollErr);
      }
    }

    toast.success('Payment completed successfully!');
    setPaymentState('success');

    const nextPath = afterPaymentPath || '/dashboard/dashboard';
    navigate(nextPath);
    return;
  } catch (err) {
    console.error(err);
    toast.error('Something went wrong while processing payment.');
  } finally {
    setLoading(false);
  }
};

  const handleOrderSummaryCTA = () => {
    if (formRef.current) {
      formRef.current.triggerSubmit();
    }
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      if (markPaid) await markPaid();
      toast.success('Payment confirmed. Your student dashboard is now unlocked.');
      setPaymentState('success');
      if (afterPaymentPath) {
        navigate(afterPaymentPath);
        return;
      }
    } catch (err) {
      console.error('Payment confirmation failed:', err);
      toast.error(err?.message || 'Unable to confirm payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <BackgroundEffects />

      <div className={styles.inner}>
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Logo />
          <BackButton />
        </motion.header>

        <AnimatePresence mode="wait">
          {paymentState === 'success' ? (
            <SuccessState key="success" />
          ) : (
            <motion.main
              key="checkout"
              className={styles.main}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <div className={styles.leftCol}>
                <div className={styles.headingWrap}>
                  <motion.h1
                    className={styles.heading}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    Complete your enrollment
                  </motion.h1>
                  <motion.p
                    className={styles.subheading}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                  >
                    Secure checkout — your data is protected by 256-bit SSL
                  </motion.p>
                </div>
                <PaymentForm
                  ref={formRef}
                  onSubmit={handlePay}
                  loading={loading}
                  errors={formErrors}
                />
              </div>

              <motion.div
                className={styles.rightCol}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <OrderSummary onPay={handleOrderSummaryCTA} loading={loading} course={pendingCourse || location.state} />
                {paymentState === 'processing' && !iframeUrl && (
                  <div style={{ marginTop: 24, padding: 18, borderRadius: 18, backgroundColor: '#0f172a', border: '1px solid rgba(148,163,184,0.18)' }}>
                    <p style={{ color: '#cbd5e1', marginBottom: 12, lineHeight: 1.6 }}>
                      Your secure checkout window is ready. After you finish the payment inside the Paymob iframe, click the button below to unlock your dashboard.
                    </p>
                    <button
                      type="button"
                      onClick={handleConfirmPayment}
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '14px 18px',
                        borderRadius: '14px',
                        border: 'none',
                        backgroundColor: '#0ea5e9',
                        color: '#ffffff',
                        fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {loading ? 'Confirming…' : 'Confirm payment completed'}
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.main>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {iframeUrl && (
          <PaymobIframe
            key="iframe"
            url={iframeUrl}
            onClose={() => setIframeUrl(null)}
          />
        )}
      </AnimatePresence>

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
