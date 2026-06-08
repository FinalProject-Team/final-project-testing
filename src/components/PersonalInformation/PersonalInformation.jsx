import React from "react";
import styles from "./PersonalInformation.module.css";

function PersonalInformation() {
  return (
    <div className={styles.infoCard}>
      <h3 className={styles.cardTitle}>Personal Information</h3>
      
      <form className={styles.formGroup} onSubmit={(e) => e.preventDefault()}>
    
        <div className={styles.rowTwoCols}>
          <div className={styles.inputWrapper}>
            <label className={styles.label}>FIRST NAME</label>
            <input type="text" defaultValue="Alex" className={styles.inputField} />
          </div>
          <div className={styles.inputWrapper}>
            <label className={styles.label}>LAST NAME</label>
            <input type="text" defaultValue="Johnson" className={styles.inputField} />
          </div>
        </div>

   
        <div className={styles.inputWrapper}>
          <label className={styles.label}>CAREER TITLE</label>
          <input 
            type="text" 
            defaultValue="Mid-Level Frontend Developer" 
            className={styles.inputField} 
          />
        </div>

       
        <div className={styles.inputWrapper}>
          <label className={styles.label}>LOCATION</label>
          <input 
            type="text" 
            defaultValue="San Francisco, CA" 
            className={styles.inputField} 
          />
        </div>

       
        <div className={styles.inputWrapper}>
          <label className={styles.label}>BIO</label>
          <textarea 
            rows="4" 
            defaultValue="Passionate frontend developer with 2 years of experience building modern web applications. Currently leveling up React and TypeScript skills through CareerTech." 
            className={styles.textareaField}
          />
        </div>
      </form>
    </div>
  );
}

export default PersonalInformation;