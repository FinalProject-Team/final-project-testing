import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { supabase } from '../../lib/supabaseClient';
import styles from './ResetPasswordPage.module.css';

const schema = yup.object({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

function EyeOpenIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function ResetPasswordPage() {
  const [showPass, setShowPass]         = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [errorMsg, setErrorMsg]         = useState('');
  const [done, setDone]                 = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const navigate = useNavigate();

  // Supabase embeds the token in the URL hash — wait for the session to be set
  useEffect(() => {
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setSessionReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
  });

  const onSubmit = async ({ password }) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      if (!supabase) throw new Error('Auth service not configured');
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.brand}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" fill="#0d1117" stroke="#0d1117" strokeWidth="0.5" />
            </svg>
          </div>
          <span className={styles.brandName}>CareerTech</span>
        </div>

        <div className={styles.card}>
          {done ? (
            <div className={styles.successState}>
              <div className={styles.successIcon}>✓</div>
              <h2 className={styles.title}>Password Updated!</h2>
              <p className={styles.subtitle}>Your password has been changed successfully. Redirecting you to login…</p>
            </div>
          ) : (
            <>
              <div className={styles.header}>
                <div className={styles.lockIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#63b3ed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </div>
                <h1 className={styles.title}>Set New Password</h1>
                <p className={styles.subtitle}>Choose a strong password for your account.</p>
              </div>

              {!sessionReady && (
                <div className={styles.alertWarn}>
                  ⚠ Verifying reset link… If this persists, please request a new reset link.
                </div>
              )}

              {errorMsg && <div className={styles.alertError} role="alert">{errorMsg}</div>}

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className={styles.formGroup}>
                  <label htmlFor="password" className={styles.label}>New Password</label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="password"
                      type={showPass ? 'text' : 'password'}
                      placeholder="At least 8 characters"
                      className={`${styles.input} ${styles.inputPad} ${errors.password ? styles.inputError : ''}`}
                      {...register('password')}
                    />
                    <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(p => !p)}>
                      {showPass ? <EyeOpenIcon /> : <EyeClosedIcon />}
                    </button>
                  </div>
                  {errors.password && <p className={styles.errorMsg}>{errors.password.message}</p>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repeat your password"
                      className={`${styles.input} ${styles.inputPad} ${errors.confirmPassword ? styles.inputError : ''}`}
                      {...register('confirmPassword')}
                    />
                    <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirm(p => !p)}>
                      {showConfirm ? <EyeOpenIcon /> : <EyeClosedIcon />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className={styles.errorMsg}>{errors.confirmPassword.message}</p>}
                </div>

                <button type="submit" className={styles.submitBtn} disabled={isLoading || !sessionReady}>
                  <span>{isLoading ? 'Updating…' : 'Update Password'}</span>
                  {!isLoading && <span>→</span>}
                </button>
              </form>

              <p className={styles.backLink}>
                <button className={styles.backBtn} onClick={() => navigate('/login')}>← Back to Login</button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
