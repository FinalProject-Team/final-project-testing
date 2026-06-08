import React from "react";
import styles from "./Documents.module.css";
import { FiUploadCloud } from "react-icons/fi";

function Documents() {
  return (
    <div className={styles.documentsCard}>
      <h3 className={styles.cardTitle}>Documents</h3>

      <div className={styles.uploadContainer}>
        
        <div className={`${styles.dropZone} ${styles.cyanZone}`}>
          <div className={`${styles.iconWrapper} ${styles.cyanIcon}`}>
            <FiUploadCloud />
          </div>
          <div className={styles.textWrapper}>
            <h4 className={styles.uploadTitle}>Upload CV / Resume</h4>
            <p className={styles.uploadSubTitle}>PDF, DOC up to 5MB</p>
          </div>
        </div>

      
        <div className={`${styles.dropZone} ${styles.purpleZone}`}>
          <div className={`${styles.iconWrapper} ${styles.purpleIcon}`}>
            <FiUploadCloud />
          </div>
          <div className={styles.textWrapper}>
            <h4 className={styles.uploadTitle}>Upload Portfolio</h4>
            <p className={styles.uploadSubTitle}>ZIP, URL, or PDF</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Documents;