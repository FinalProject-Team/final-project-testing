import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Courses.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          'https://final-project-backend-production-214a.up.railway.app/api/courses'
        );

        const data = Array.isArray(response.data) ? response.data : [];
        setCourses(data.filter(c => c.title));
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError('Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);




  const FALLBACK_THUMBNAILS = [
    'https://via.placeholder.com/480x270?text=Course+1',
    'https://via.placeholder.com/480x270?text=Course+2',
    'https://via.placeholder.com/480x270?text=Course+3',
  ];

  const getThumbnail = (course, index) =>
    course.thumbnail || FALLBACK_THUMBNAILS[index % FALLBACK_THUMBNAILS.length];

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Free';
    return `${price.toLocaleString()} EGP`;
  };

  const renderStars = (rating) =>
    '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));

  if (loading) {
    return (
      <section className={styles.courses} id="courses">
        <div className={styles.header}>
          <span className={styles.badgeSmall}>Our Courses</span>
          <h2 className={styles.title}>
            Explore <span className={styles.gradient}>Top Courses</span>
          </h2>
          <p className={styles.subtitle}>
            Hand-picked courses taught by industry experts to get you job-ready fast.
          </p>
        </div>

        <div className={styles.grid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`${styles.card} ${styles.skeleton}`}>
              <div className={styles.skeletonImage} />
              <div className={styles.cardContent}>
                <div className={styles.skeletonLine} style={{ width: '75%' }} />
                <div className={styles.skeletonLine} style={{ width: '90%', height: '0.75rem' }} />
                <div className={styles.skeletonLine} style={{ width: '55%', height: '0.75rem' }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || courses.length === 0) return null;

  return (
    <section className={styles.courses} id="courses">
      <div className={styles.header}>
        <span className={styles.badgeSmall}>Our Courses</span>
        <h2 className={styles.title}>
          Explore <span className={styles.gradient}>Top Courses</span>
        </h2>
        <p className={styles.subtitle}>
          Hand-picked courses taught by industry experts to get you job-ready fast.
        </p>
      </div>

      <div className={styles.grid}>
        {courses.map((course, index) => (
          <div
            key={course.id}
            className={styles.card}
            onClick={() => navigate(`/course/${course.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.cardImage}>
              <img
                src={getThumbnail(course, index)}
                alt={course.title}
                loading="lazy"
              />

              {course.course_type && (
                <div className={styles.typeBadge}>{course.course_type}</div>
              )}

              {course.level && (
                <div className={styles.levelBadge}>{course.level}</div>
              )}
            </div>

            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{course.title}</h3>

              {course.description && (
                <p className={styles.cardDescription}>{course.description}</p>
              )}

              <div className={styles.meta}>
                {course.instructor && (
                  <span className={styles.instructor}>👤 {course.instructor}</span>
                )}

                {course.duration && (
                  <span className={styles.duration}>⏱ {course.duration}</span>
                )}

                {course.language && (
                  <span className={styles.language}>🌐 {course.language}</span>
                )}
              </div>

              {course.lessons_count > 0 && (
                <div className={styles.lessons}>
                  📚 {course.lessons_count} Lessons
                </div>
              )}

              <div className={styles.cardFooter}>
                <div className={styles.ratingBlock}>
                  {course.rating > 0 && (
                    <>
                      <span className={styles.stars}>{renderStars(course.rating)}</span>
                      <span className={styles.ratingValue}> {course.rating}</span>
                    </>
                  )}
                </div>

                <div className={styles.price}>{formatPrice(course.price)}</div>
              </div>

              <button
                type="button"
                className={styles.enrollBtn}
                onClick={(e) => {
                  e.stopPropagation();

                  const pending = { courseId: course.id, courseTitle: course.title, price: course.price };

                  try {
                    sessionStorage.setItem('pendingCourse', JSON.stringify(pending));
                    sessionStorage.setItem('afterPayment', '/dashboard/dashboard');
                    sessionStorage.setItem('returnPath', '/payment');
                  } catch {}

                  if (!isAuthenticated) {
                    navigate('/login', { state: { from: { pathname: '/payment' } } });
                    return;
                  }

                  navigate('/payment', { state: pending });
                }}
              >
                Enroll Now →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}