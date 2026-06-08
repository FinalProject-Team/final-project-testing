import React from "react";
import styles from "./Profileheader.module.css";
import { Button } from "react-bootstrap";
import { FiEdit, FiMapPin, FiCamera, FiGlobe } from "react-icons/fi";
import { FaRegStar, FaBriefcase } from "react-icons/fa";
import userAvatar from "../../assets/images/2e7d95f9-38ae-440d-a7ef-9071b45a31b4-1024x1024 (1).webp";

function ProfileHeader() {
  return (
    <div className={styles.headerCard}>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-4 w-100">
        
        <div className="d-flex align-items-center flex-wrap gap-4">
          <div className={styles.avatarWrapper}>
        
        
            <img
  src={userAvatar}
  alt="Alex Johnson"
  className={styles.avatar}
/>
            <div className={styles.cameraBtn}>
              <FiCamera />
            </div>
          </div>

          <div className={styles.infoWrapper}>
            <h2 className={styles.name}>Alex Johnson</h2>
            <p className={styles.role}>Mid-Level Frontend Developer</p>
            
            <p className={styles.location}>
              <FiMapPin /> San Francisco, CA
            </p>

            <div className={styles.statsRow}>
              <span className={styles.statItem}>
                <FaRegStar className={styles.starIcon} /> 4,820 XP
              </span>
              <span className={styles.statItem}>
                <FaBriefcase className={styles.briefcaseIcon} /> 7 Applications
              </span>
              <span className={styles.statItem}>
                <FiGlobe className={styles.globeIcon} /> 12 Courses
              </span>
            </div>
          </div>
        </div>

        <button className={styles.editBtn}>
          <FiEdit /> Edit Profile
        </button>

      </div>
    </div>
  );
}

export default ProfileHeader;