import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhoneAlt, FaLock, FaEye, FaEyeSlash, FaBriefcase, FaBuilding } from 'react-icons/fa';
import styles from './JobRegister.module.css'; 
import { FcGoogle } from 'react-icons/fc';
import { registerUser, loginWithGoogle } from "../services/authServices";
import * as yup from 'yup';

const schema = yup.object().shape({
  fullName: yup
    .string()
    .required("Full name is required")
    .min(3, "Name must be at least 3 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^01[0125][0-9]{8}$/, "Please enter a valid Egyptian phone number"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref('password'), null], "Passwords do not match"),
});

export default function JobRegister() {
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
      setErrors({
        ...errors,
        [e.target.name]: ""
      });
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Google login error:", error.message);
      setToastType("error");
      setToastMessage("Google login failed: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await schema.validate(formData, { abortEarly: false });
      setErrors({});

      const response = await registerUser({
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        confirmPassword: formData.confirmPassword
      });

      console.log(response);

      if (response?.data?.token) {
        localStorage.setItem("token", response.data.token);
      }
      
      setToastType("success");
      setToastMessage("Professional account created! Redirecting to jobs...");
      
      setTimeout(() => {
        navigate("/dashboard/jobs");
      }, 1000); 

    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else {
        console.log(err);
        setToastType("error");
        
        const serverMessage = err.response?.data?.message || err.message || "";
        const statusCode = err.response?.status;
        
        if (statusCode === 404 || statusCode === 400 || serverMessage.toLowerCase().includes("already") || serverMessage.toLowerCase().includes("exists")) {
          setToastMessage("This email is already registered! Try logging in.");
        } else {
          setToastMessage(serverMessage || "Registration failed. Please try again.");
        }
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        {toastMessage && (
          <div className={`${styles.toast} ${toastType === 'success' ? styles.toastSuccess : styles.toastError}`}>
            {toastType === 'success' ? '💼 ' : '❌ '} {toastMessage}
          </div>
        )}

        <div className={styles.headerArea}>
          <FaBriefcase className={styles.jobLogo} />
          <h1 className={styles.title}>CareerTech <span className={styles.badge}>Jobs</span></h1>
        </div>
        <p className={styles.subtitle}>Create your professional profile to apply for jobs</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          
          <div className={styles.inputGroup}>
            <FaUser className={styles.iconLeft} />
            <input type="text" name="fullName" placeholder="Full Name (As in CV)" className={styles.input} value={formData.fullName} onChange={handleChange} />
          </div>
          {errors.fullName && <p className={styles.errorText}>{errors.fullName.message || errors.fullName}</p>}

          <div className={styles.inputGroup}>
            <FaEnvelope className={styles.iconLeft} />
            <input type="email" name="email" placeholder="Professional Email address" className={styles.input} value={formData.email} onChange={handleChange} />
          </div>
          {errors.email && <p className={styles.errorText}>{errors.email.message || errors.email}</p>}

          <div className={styles.inputGroup}>
            <FaPhoneAlt className={styles.iconLeft} />
            <input type="tel" name="phone" placeholder="Contact number" className={styles.input} value={formData.phone} onChange={handleChange} />
          </div>
          {errors.phone && <p className={styles.errorText}>{errors.phone.message || errors.phone}</p>}

          <div className={styles.inputGroup}>
            <FaLock className={styles.iconLeft} />
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" className={`${styles.input} ${styles.inputPassword}`} value={formData.password} onChange={handleChange} />            
            <span className={styles.iconRight} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <p className={styles.errorText}>{errors.password.message || errors.password}</p>}

          <div className={styles.inputGroup}>
            <FaLock className={styles.iconLeft} />
            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" className={`${styles.input} ${styles.inputPassword}`} value={formData.confirmPassword} onChange={handleChange} />
            <span className={styles.iconRight} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.confirmPassword && <p className={styles.errorText}>{errors.confirmPassword.message || errors.confirmPassword}</p>}

          <button type="submit" className={styles.btn}>
            <FaBuilding className={styles.btnIcon} />
            Join Job 
          </button>       
        </form>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <button type="button" className={styles.googleBtn} onClick={handleGoogleLogin}>
          <FcGoogle className={styles.googleIcon} />
          Sign up with Google
        </button>

        <p className={styles.footerText}>
          Looking for talent? <span className={styles.employerLink}>Register as Employer</span>
        </p>
      </div>
    </div>
  );
}