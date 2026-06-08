import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Video,
  User,
  Zap,
} from "lucide-react";

import styles from "./InstructorDashboardSidebar.module.css";

function InstructorDashboardSidebar({ isOpen, onClose }) {
  const links = [
    {
      to: "/instructor/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/instructor/courses",
      label: "Courses",
      icon: BookOpen,
    },
    {
      to: "/instructor/lessons",
      label: "Lessons",
      icon: FileText,
    },
    {
      to: "/instructor/interactive-sessions",
      label: "Interactive Sessions",
      icon: Video,
    },
    {
      to: "/instructor/profile",
      label: "Profile",
      icon: User,
    },
  ];

  return (
    <aside
      className={`${styles.sidebar} ${
        isOpen ? styles.open : ""
      }`}
    >
      <button
        className={styles.closeBtn}
        onClick={onClose}
      >
        ×
      </button>

      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <Zap size={24} />
        </div>

        <div>
          <h2>CareerTech</h2>
          <p>Instructor Hub</p>
        </div>
      </div>

      <nav className={styles.nav}>
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                isActive
                  ? `${styles.link} ${styles.active}`
                  : styles.link
              }
            >
              <Icon size={22} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className={styles.userBox}>
        <div className={styles.avatar}>I</div>

        <div>
          <h4>Instructor</h4>
          <p>Manage courses</p>
        </div>
      </div>
    </aside>
  );
}

export default InstructorDashboardSidebar;