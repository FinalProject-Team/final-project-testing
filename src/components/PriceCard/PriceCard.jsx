import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./PriceCard.module.css";

export default function PriceCard({ course }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const price = course?.price ?? 0;
  const level = course?.level ?? "All levels";
  const duration = course?.duration ?? "N/A";

  const lessonsCount =
    course?.lessons?.length || course?.lessons_count || 0;

  const studentsCount =
    course?.students_count || course?.students || 0;

  const handleEnrollClick = () => {
    const pending = {
      courseId: course?.id,
      courseTitle: course?.title,
      price: course?.price,
    };

    try {
      sessionStorage.setItem('pendingCourse', JSON.stringify(pending));
      sessionStorage.setItem('afterPayment', '/dashboard/dashboard');
      sessionStorage.setItem('returnPath', '/payment');
    } catch (error) {
      // ignore storage errors
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/payment' } } });
      return;
    }

    navigate('/payment', { state: pending });
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.price}>
        {price === 0 ? "Free" : `${price.toLocaleString()} EGP`}
      </h2>

      <span className={styles.level}>{level}</span>

      <button type="button" className={styles.button} onClick={handleEnrollClick}>
        Enroll Now
      </button>

      <p className={styles.guarantee}>Full lifetime access</p>

      <ul className={styles.features}>
        <li>
          <span>✔</span>
          {duration}
        </li>

        <li>
          <span>✔</span>
          {lessonsCount} lessons
        </li>

        <li>
          <span>✔</span>
          {studentsCount}+ students
        </li>

        <li>
          <span>✔</span>
          Certificate included
        </li>
      </ul>
    </div>
  );
}