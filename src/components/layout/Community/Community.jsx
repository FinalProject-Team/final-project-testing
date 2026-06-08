import { useState } from "react";
import styles from "./Community.module.css";
import Feed from "./Feed/Feed";
import RightSidebar from "./Rightsidebar/RightSidebar";
import { useAuth } from "../../../context/AuthContext";

export default function Community() {
  const { user } = useAuth();

  // Guard — don't render until auth resolves
  if (!user) return null;

  return (
    <div className={styles.root}>
      <div className={styles.layout}>
        {/* Only the center feed col scrolls */}
        <div className={styles.feedCol}>
          <Feed />
        </div>
        <RightSidebar />
      </div>
    </div>
  );
}
