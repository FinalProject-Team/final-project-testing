import React from "react";
import PersonalInformation from "../PersonalInformation/PersonalInformation";
import SocialLinks from "../SocialLinks/SocialLinks";
import Documents from "../Documents/Documents";
import Skills from "../Skills/Skills";
import styles from "./Profile.module.css"; 

function Profile() {
  return (
    // هنا استبدلنا profileContainer بـ profileWrapper
    <div className={styles.profileWrapper}> 
      
      {/* هنا استبدلنا mainContent بـ mainGrid */}
      <div className={styles.mainGrid}>
        <div className={styles.leftColumn}>
          <PersonalInformation />
        </div>
        <div className={styles.rightColumn}>
          <SocialLinks />
          <Documents />
        </div>
      </div>
     
      <div className={styles.bottomSection}>
        <Skills />
      </div>
    </div>
  );
}

export default Profile;