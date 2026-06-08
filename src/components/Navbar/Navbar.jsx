import { Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, role, signOut, getDashboardPath } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.logoSection}>
          <Link to="/" className={styles.logo} style={{ textDecoration: 'none' }}>
            <div className={styles.logoIcon}>✦</div>
            <span>CareerTech</span>
          </Link>
        </div>

        <button
          className={styles.menuToggle}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`${styles.navLinks} ${isOpen ? styles.active : ''}`}>
          <a href="#home"    onClick={() => setIsOpen(false)}>Home</a>
          <a href="#tracks"  onClick={() => setIsOpen(false)}>Tracks</a>
          <a href="#courses" onClick={() => setIsOpen(false)}>Courses</a>
          <a href="#about"   onClick={() => setIsOpen(false)}>About</a>
          <a href="#jobs"    onClick={() => setIsOpen(false)}>Apply Job</a>
        </div>

        <div className={styles.authButtons}>
          <button
            className={styles.themeToggle}
            onClick={toggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            <>
              <Link to={getDashboardPath()} className={styles.loginBtn}>
                Dashboard
              </Link>
              <button className={styles.signupBtn} onClick={handleSignOut}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className={styles.loginBtn}>Login</Link>
              <Link to="/register" className={styles.signupBtn}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
