import React from "react";
import styles from "./SocialLinks.module.css";
import { FiGlobe, FiTwitter, FiLinkedin, FiGithub } from "react-icons/fi";

function SocialLinks() {
  return (
    <div className= {styles.socialCard}>
      <h3 className={styles.cardTitle}>Social Links</h3>

      <form className={styles.formGroup} onSubmit={(e) => e.preventDefault()}>
        
    
        <div className={styles.inputWrapper}>
          <label className={styles.label}>WEBSITE</label>
          <div className={styles.inputContainer}>
            <FiGlobe className={styles.inputIcon} />
            <input type="text" defaultValue="alexjohnson.dev" className={styles.inputField} />
          </div>
        </div>

   
        <div className={styles.inputWrapper}>
          <label className={styles.label}>TWITTER</label>
          <div className={styles.inputContainer}>
            <FiTwitter className={styles.inputIcon} />
            <input type="text" defaultValue="@alexjohnson" className={styles.inputField} />
          </div>
        </div>

      
        <div className={styles.inputWrapper}>
          <label className={styles.label}>LINKEDIN</label>
          <div className={styles.inputContainer}>
            <FiLinkedin className={styles.inputIcon} />
            <input type="text" defaultValue="linkedin.com/in/alexjohnson" className={styles.inputField} />
          </div>
        </div>

       
        <div className={styles.inputWrapper}>
          <label className={styles.label}>GITHUB</label>
          <div className={styles.inputContainer}>
            <FiGithub className={styles.inputIcon} />
            <input type="text" defaultValue="github.com/alexjohnson" className={styles.inputField} />
          </div>
        </div>

      </form>
    </div>
  );
}

export default SocialLinks;