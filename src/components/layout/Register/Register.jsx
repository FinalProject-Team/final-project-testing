import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhoneAlt, FaLock, FaEye, FaEyeSlash, FaUserPlus, FaArrowLeft } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import styles from './Register.module.css';
import { registerUser, loginWithGoogle } from "../services/authServices";
import * as yup from 'yup';

const schema = yup.object().shape({
 fullName: yup.string().required("Full name is required").min(3),
 email: yup.string().required().email(),
 phone: yup.string().required().matches(/^01[0125][0-9]{8}$/),
 password: yup.string().required().min(6),
 confirmPassword: yup
 .string()
 .required("Confirm password is required")
 .oneOf([yup.ref('password')], "Passwords do not match"),
});

export default function Register() {
 const [showPassword, setShowPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 const [selectedRole, setSelectedRole] = useState("student");

 const [formData, setFormData] = useState({
 fullName: "",
 email: "",
 phone: "",
 password: "",
 confirmPassword: "",
 });

 const [errors, setErrors] = useState({});

 // toast state (مرة واحدة فقط)
 const [toastMessage, setToastMessage] = useState("");
 const [toastType, setToastType] = useState("");

 const navigate = useNavigate();

 // hide toast after 4s
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
 setFormData({
 ...formData,
 [e.target.name]: e.target.value,
 });

 if (errors[e.target.name]) {
 setErrors({ ...errors, [e.target.name]: "" });
 }
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
 await registerUser({
 full_name: formData.fullName,
 email: formData.email,
 password: formData.password,
 confirmPassword: formData.confirmPassword,
 phone: formData.phone,
 role: selectedRole,
 });

 setToastType("success");
 setToastMessage("Registration successful! Redirecting to login...");

 setTimeout(() => {
 navigate("/login");
 }, 2000);

 } catch (err) {
 if (err.name === "ValidationError") {
 const validationErrors = {};
 err.inner.forEach((error) => {
 validationErrors[error.path] = error.message;
 });
 setErrors(validationErrors);
 } else {
 setToastType("error");

 const serverMessage =
 err.response?.data?.message || err.message || "";

 const statusCode = err.response?.status;

 if (
 statusCode === 409 ||
 statusCode === 400 ||
 serverMessage.toLowerCase().includes("already") ||
 serverMessage.toLowerCase().includes("exists")
 ) {
 setToastMessage("This email is already registered! Try logging in.");
 } else {
 setToastMessage(serverMessage || "Registration failed");
 }
 }
 }
 };

 return (
 <div className={styles.pageWrapper}>
 <div className={styles.glowEffect}></div>
 <div className={styles.glowEffectLeft}></div>

 <div className={styles.registerContainer}>
 {/* Back Button */}
 <Link to="/login" className={styles.backButton} title="Back to login">
 <FaArrowLeft /> Back
 </Link>

 {/* Brand Section */}
 <div className={styles.brandSection}>
 <div className={styles.logoIcon}>⚡</div>
 <span className={styles.brandName}>CareerTech</span>
 </div>

 {/* Heading */}
 <div className={styles.headingSection}>
 <h1 className={styles.welcomeTitle}>Join Our Community</h1>
 <p className={styles.welcomeSubtitle}>Create an account to get started with CareerTech</p>
 </div>

 {/* Toast Messages */}
 {toastMessage && (
 <div className={`${styles.alert} ${toastType === 'success' ? styles.alertSuccess : styles.alertError}`}>
 <span>{toastType === 'success' ? '✅ ' : '❌ '} {toastMessage}</span>
 </div>
 )}

 {/* Card */}
 <div className={styles.card}>

 {/* Google Button */}
 <button
 type="button"
 onClick={handleGoogleLogin}
 className={styles.googleBtn}
 >
 <FcGoogle size={18} /> Sign up with Google
 </button>

 <div className={styles.divider}>OR</div>

 {/* Account Type Selection */}
 <div className={styles.accountTypeSection}>
 <label className={styles.accountTypeLabel}>Select Account Type:</label>
 <div className={styles.accountTypeOptions}>
 <button
 type="button"
 className={`${styles.accountTypeBtn} ${selectedRole === 'student' ? styles.active : ''}`}
 onClick={() => setSelectedRole('student')}
 >
 <span className={styles.roleIcon}>📚</span>
 <span className={styles.roleName}>Student</span>
 <span className={styles.roleDesc}>Learn courses & skills</span>
 </button>
 <button
 type="button"
 className={`${styles.accountTypeBtn} ${selectedRole === 'job_seeker' ? styles.active : ''}`}
 onClick={() => setSelectedRole('job_seeker')}
 >
 <span className={styles.roleIcon}>💼</span>
 <span className={styles.roleName}>Job Seeker</span>
 <span className={styles.roleDesc}>Post jobs & hire talent</span>
 </button>
 </div>
 </div>

 {/* Form */}
 <form className={styles.form} onSubmit={handleSubmit}>

 <div className={styles.inputGroup}>
 <FaUser className={styles.iconLeft} />
 <input
 type="text"
 name="fullName"
 placeholder="Full Name"
 value={formData.fullName}
 onChange={handleChange}
 />
 {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
 </div>

 <div className={styles.inputGroup}>
 <FaEnvelope className={styles.iconLeft} />
 <input
 type="email"
 name="email"
 placeholder="Email Address"
 value={formData.email}
 onChange={handleChange}
 />
 {errors.email && <span className={styles.errorText}>{errors.email}</span>}
 </div>

 <div className={styles.inputGroup}>
 <FaPhoneAlt className={styles.iconLeft} />
 <input
 type="tel"
 name="phone"
 placeholder="Phone Number (01XXXXXXXXX)"
 value={formData.phone}
 onChange={handleChange}
 />
 {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
 </div>

 <div className={styles.inputGroup}>
 <FaLock className={styles.iconLeft} />
 <input
 type={showPassword ? "text" : "password"}
 name="password"
 placeholder="Password (min 6 characters)"
 value={formData.password}
 onChange={handleChange}
 />
 <button
 type="button"
 className={styles.eyeButton}
 onClick={() => setShowPassword(!showPassword)}
 >
 {showPassword ? <FaEyeSlash /> : <FaEye />}
 </button>
 {errors.password && <span className={styles.errorText}>{errors.password}</span>}
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
 <button
 type="button"
 className={styles.eyeButton}
 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
 >
 {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
 </button>
 {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
 </div>

 <button type="submit" className={styles.submitBtn}>
 <FaUserPlus /> Create Account
 </button>

 </form>

 </div>

 {/* Footer */}
 <p className={styles.footerText}>
 Already have an account? <Link to="/login" className={styles.loginLink}>Sign In</Link>
 </p>

 </div>
 </div>
 );
}

