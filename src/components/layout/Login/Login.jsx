import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabaseClient';
import styles from './Login.module.css';

// ── Validation schemas ────────────────────────────────────────────────────────
const loginSchema = yup.object({
  email:    yup.string().required('Email is required').email('Please enter a valid email'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

const forgotSchema = yup.object({
  email: yup.string().required('Email is required').email('Please enter a valid email'),
});

// ── Icon helpers ──────────────────────────────────────────────────────────────
function BoltLogo() {
  return (
    <div className={styles.logoIcon}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" fill="#0d1117" stroke="#0d1117" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
        <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05" />
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
      </g>
    </svg>
  );
}

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

function MailIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#63b3ed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

// ── Forgot Password Modal ─────────────────────────────────────────────────────
function ForgotPasswordModal({ onClose }) {
  const [step, setStep]       = useState('form'); // 'form' | 'sent'
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg]   = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(forgotSchema),
    mode: 'onTouched',
  });

  const onSubmit = async ({ email }) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      if (!supabase) throw new Error('Auth service not configured');
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setStep('sent');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modalCard}>

        {step === 'form' ? (
          <>
            <button className={styles.modalBack} onClick={onClose} aria-label="Back to login">
              <ArrowLeftIcon /> Back to Login
            </button>

            <div className={styles.modalHeader}>
              <div className={styles.modalIconWrap}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#63b3ed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>
              <h2 className={styles.modalTitle}>Reset Password</h2>
              <p className={styles.modalSubtitle}>
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {errorMsg && (
              <div className={styles.alertError} role="alert">{errorMsg}</div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className={styles.formGroup}>
                <label htmlFor="reset-email" className={styles.label}>Email Address</label>
                <div className={styles.inputWrapper}>
                  <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    placeholder="alex@example.com"
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className={styles.errorMsg} role="alert">{errors.email.message}</p>}
              </div>

              <button type="submit" className={styles.loginBtn} disabled={isLoading}>
                <span className={styles.loginBtnText}>
                  {isLoading ? 'Sending…' : 'Send Reset Link'}
                </span>
                {!isLoading && <span className={styles.arrowIcon}>→</span>}
              </button>
            </form>
          </>
        ) : (
          <div className={styles.sentState}>
            <div className={styles.sentIconWrap}><MailIcon /></div>
            <h2 className={styles.modalTitle}>Check your email</h2>
            <p className={styles.modalSubtitle}>
              We've sent a password reset link to your email address. Check your inbox and follow the instructions.
            </p>
            <p className={styles.sentHint}>Didn't receive it? Check your spam folder.</p>
            <button className={styles.loginBtn} onClick={onClose}>
              <span className={styles.loginBtnText}>Back to Login</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ── Main Login Component ──────────────────────────────────────────────────────
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [authError, setAuthError]       = useState('');
  const [showForgot, setShowForgot]     = useState(false);

  const { signInWithEmail, signInWithGoogle, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
  resolver: yupResolver(loginSchema),
  mode: 'onTouched',
});

  const storedReturnPath = sessionStorage.getItem('returnPath');
  const redirectPath = location.state?.from?.pathname || storedReturnPath || '/';

  if (!loading && isAuthenticated) {
    if (storedReturnPath) {
      sessionStorage.removeItem('returnPath');
    }
    return <Navigate to={redirectPath} replace />;
  }

  const onSubmit = async (data) => {

    setIsLoading(true);
    setAuthError('');
    try {
      const result = await signInWithEmail(data.email, data.password);
const role = result?.backendRole;

if (role === 'admin') {
  return navigate('/admin');
}

if (role === 'instructor') {
  return navigate('/instructor/dashboard');
}

if (role === 'employer') {
  return navigate('/dashboard/employer');
}

if (role === 'job_seeker' || role === 'normal_user') {
  return navigate('/dashboard/normal-user');
}

if (role === 'student') {
  return navigate('/dashboard/dashboard');
}

navigate('/');
    } catch (error) {
      setAuthError(
        error.message === 'Invalid login credentials'
          ? 'Invalid email or password'
          : error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError('');
    try {
      const result = await signInWithGoogle();
      if (result?.url) {
        window.location.assign(result.url);
      }
    } catch (error) {
      setAuthError(error.message);
    }
  };

  return (
    <>
      <div className={styles.pageWrapper}>
        <div className={styles.glowEffect} aria-hidden="true" />
        <div className={styles.glowEffectLeft} aria-hidden="true" />

        <div className={styles.loginContainer}>
          <div className={styles.brandSection}>
            <BoltLogo />
            <span className={styles.brandName}>CareerTech</span>
          </div>

          <div className={styles.headingSection}>
            <h1 className={styles.welcomeTitle}>Welcome back</h1>
            <p className={styles.welcomeSubtitle}>Sign in to continue your learning journey</p>
          </div>

          <div className={styles.card}>
            <button type="button" className={styles.googleBtn} onClick={handleGoogleLogin} aria-label="Continue with Google">
              <span className={styles.googleIconWrapper}><GoogleIcon /></span>
              Continue with Google
            </button>

            <div className={styles.divider} role="separator">
              <div className={styles.dividerLine} />
              <span className={styles.dividerText}>or continue with email</span>
              <div className={styles.dividerLine} />
            </div>

            {authError && <div className={styles.alertError} role="alert">{authError}</div>}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className={styles.formGroup}>
                <div className={styles.fieldHeader}>
                  <label htmlFor="email" className={styles.label}>Email</label>
                </div>
                <div className={styles.inputWrapper}>
                  <input
                    id="email" type="email" autoComplete="email"
                    placeholder="alex@example.com"
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className={styles.errorMsg} role="alert">{errors.email.message}</p>}
              </div>

              <div className={styles.formGroup}>
                <div className={styles.fieldHeader}>
                  <label htmlFor="password" className={styles.label}>Password</label>
                  <button
                    type="button"
                    className={styles.forgotLink}
                    onClick={() => setShowForgot(true)}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className={styles.inputWrapper}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={`${styles.input} ${styles.inputPassword} ${errors.password ? styles.inputError : ''}`}
                    {...register('password')}
                  />
                  <button
                    type="button" className={styles.eyeBtn}
                    onClick={() => setShowPassword(p => !p)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                  </button>
                </div>
                {errors.password && <p className={styles.errorMsg} role="alert">{errors.password.message}</p>}
              </div>

              <button type="submit" className={styles.loginBtn} disabled={isLoading}>
                <span className={styles.loginBtnText}>{isLoading ? 'Signing in…' : 'Log In'}</span>
                {!isLoading && <span className={styles.arrowIcon}>→</span>}
              </button>
            </form>

            <p className={styles.signupRow}>
              Don&apos;t have an account?{' '}
              <a href="/register" className={styles.signupLink}
                onClick={(e) => { e.preventDefault(); navigate('/register'); }}>
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>

      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
    </>
  );
}
