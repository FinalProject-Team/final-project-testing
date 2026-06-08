import React from "react";
import styles from "./Skills.module.css";

function Skills() {
  const skillsList = [
    "React", "JavaScript", "TypeScript", "HTML5", 
    "CSS3", "Tailwind CSS", "Git", "REST APIs", 
    "Node.js", "Figma"
  ];

  return (
    <div className={styles.skillsCard}>
      <h3 className={styles.cardTitle}>Skills</h3>
      <div className={styles.tagsWrapper}>
        {skillsList.map((skill, index) => (
          <span key={index} className={styles.skillTag}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Skills;