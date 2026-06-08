import { useState } from "react";
import { Outlet } from "react-router-dom";
import InstructorDashboardSidebar from "../InstructorDashboardSidebar/InstructorDashboardSidebar";
import styles from "./InstructorDashboardLayout.module.css";

function InstructorDashboardLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <button
        className={styles.menuBtn}
        onClick={() => setIsOpen(true)}
      >
        ☰
      </button>

      <InstructorDashboardSidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      {isOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsOpen(false)}
        />
      )}

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}

export default InstructorDashboardLayout;