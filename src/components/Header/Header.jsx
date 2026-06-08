import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import styles from "./Header.module.css";

export default function Header({ course }) {
  const navigate = useNavigate();

  return (
    <header
      className={styles.header}
      style={{
        backgroundImage: `url(${course.thumbnail || course.image})`,
      }}
    >
      <div className={styles.overlay}></div>

      <div className={styles.content}>
       <button
       type="button"
       className={styles.backButton}
       onClick={() => {
         window.location.assign("/#courses");
       }}
>
       <FaArrowLeft />
      <span>Back to Courses</span>
       </button>

        <div className={styles.tags}>
          <span className={styles.level}>{course.level}</span>
          <span className={styles.duration}>{course.duration}</span>
        </div>

        <h1 className={styles.title}>{course.title}</h1>

        <p className={styles.description}>{course.description}</p>
      </div>
    </header>
  );
}