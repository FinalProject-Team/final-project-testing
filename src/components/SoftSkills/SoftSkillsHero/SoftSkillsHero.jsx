import styles from "./SoftSkillsHero.module.css";

function SoftSkillsHero() {
  return (
    <section className={styles.hero}>
      <span className={styles.badge}>Soft Skills Academy</span>

      <h1>The Edge That Gets You Hired</h1>

      <p>
        92% of hiring managers say soft skills are as important as technical
        skills. Level up your professional toolkit.
      </p>
    </section>
  );
}

export default SoftSkillsHero;