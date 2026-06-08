import styles from "./InstructorCard.module.css";

export default function InstructorCard({ course }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.heading}>Your Instructor</h2>

      <div className={styles.instructorInfo}>
        <img
          className={styles.avatar}
          src={
            course.instructor_image ||
            "https://randomuser.me/api/portraits/men/32.jpg"
          }
          alt={course.instructor || "Instructor"}
        />

        <div>
          <h3 className={styles.name}>{course.instructor}</h3>

          <p className={styles.role}>
            {course.instructor_title || "Course Instructor"}
          </p>

          <span className={styles.stats}>
            ⭐ {course.rating} • {course.students_count || 0} students
          </span>
        </div>
      </div>
    </div>
  );
}