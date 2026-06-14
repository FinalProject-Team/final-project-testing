import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhoneAlt, FaLock, FaEye, FaEyeSlash, FaUserPlus } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import styles from './Register.module.css';
import { registerUser, loginWithGoogle } from "../services/authServices";
import * as yup from 'yup';

const schema = yup.object().shape({
  fullName: yup.string().required("Full name is required").min(3),
  email: yup.string().required("Email is required").email("Please enter a valid email"),
  phone: yup.string().required("Phone number is required").matches(/^01[0125][0-9]{8}$/, "Please enter a valid Egyptian phone number"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], "Passwords do not match"),
});

export default function NormalUserRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage("");
        setToastType("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      setToastType("error");
      setToastMessage("Google login failed: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await schema.validate(formData, { abortEarly: false });
      setErrors({});

      await registerUser({
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: 'job_seeker',
      });

      setToastType("success");
      setToastMessage("Account created! Redirecting to login…");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      if (err.name === "ValidationError") {
        const newErrors = {};
        err.inner.forEach((e) => { newErrors[e.path] = e.message; });
        setErrors(newErrors);
      } else {
        setToastType("error");
        setToastMessage(err?.response?.data?.message || "Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {toastMessage && (
          <div className={`${styles.toast} ${toastType === 'success' ? styles.toastSuccess : styles.toastError}`}>
            {toastType === 'success' ? '✅ ' : '❌ '} {toastMessage}
          </div>
        )}

        <h1 className={styles.title}>CareerTech</h1>
        <p className={styles.subtitle}>Create a free account to browse & apply for jobs</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <FaUser className={styles.iconLeft} />
            <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
            {errors.fullName && <span className={styles.error}>{errors.fullName}</span>}
          </div>

          <div className={styles.inputGroup}>
            <FaEnvelope className={styles.iconLeft} />
            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>

          <div className={styles.inputGroup}>
            <FaPhoneAlt className={styles.iconLeft} />
            <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
            {errors.phone && <span className={styles.error}>{errors.phone}</span>}
          </div>

          <div className={styles.inputGroup}>
            <FaLock className={styles.iconLeft} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && <span className={styles.error}>{errors.password}</span>}
          </div>

          <div className={styles.inputGroup}>
            <FaLock className={styles.iconLeft} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className={styles.btn}>
            <FaUserPlus /> Sign Up Free
          </button>
        </form>

        <div className={styles.divider}>OR</div>

        <button onClick={handleGoogleLogin} className={styles.googleBtn}>
          <FcGoogle /> Continue with Google
        </button>

        <p className={styles.footerText}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
        <p className={styles.footerText}>
          Looking to post jobs? <Link to="/register-job">Register as Job Seeker</Link>
        </p>
      </div>
    </div>
  );
}
