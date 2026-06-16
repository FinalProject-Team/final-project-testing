import { useState, useEffect } from 'react';
import styles from './Courses.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiGetAllCourses, BASE_URL } from '../../services/api/api';


export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brokenImages, setBrokenImages] = useState({});

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        const data = await apiGetAllCourses();
        const list = Array.isArray(data) ? data : data?.courses || [];
        setCourses(list.filter(c => c.title));
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError('Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);




  const getThumbnail = (course) => {
    const t = course.thumbnail || course.image || course.image_url;
    // guard against missing/empty values and stringified nulls coming from the API
    if (!t || t === 'null' || t === 'undefined') return null;
    // if absolute url, use as-is
    if (/^(https?:)?\/\//i.test(t)) return t;
    // otherwise prefix with BASE_URL
    const prefix = BASE_URL.replace(/\/$/, '');
    const path = t.startsWith('/') ? t : `/${t}`;
    return `${prefix}${path}`;
  };

  const handleImageError = (courseId) => {
    setBrokenImages((prev) => (prev[courseId] ? prev : { ...prev, [courseId]: true }));
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Free';
    return `${price.toLocaleString()} EGP`;
  };

  const renderStars = (rating) =>
    '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));

  if (loading) {
    return (
      <section className={styles.courses} id="courses">
        <div id="coursesHero" />
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
      <div id="coursesHero" />
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
        {courses.map((course) => {
          const thumbnail = getThumbnail(course);
          const showFallback = !thumbnail || brokenImages[course.id];

          return (
            <div
              key={course.id}
              className={styles.card}
              onClick={() => navigate(`/course/${course.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.cardImage}>
                {showFallback ? (
                  <div className={styles.imageFallback}>
                    <svg
                      className={styles.fallbackIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 3.5L2.5 8.5l9.5 5 7.5-3.95V15h1.5V8.5L12 3.5z"
                        fill="currentColor"
                      />
                      <path
                        d="M5.5 11.6v3.9c0 1.86 2.9 3.5 6.5 3.5s6.5-1.64 6.5-3.5v-3.9L12 15 5.5 11.6z"
                        fill="currentColor"
                        opacity="0.85"
                      />
                    </svg>
                  </div>
                ) : (
                  <img
                    src={thumbnail}
                    alt={course.title}
                    loading="lazy"
                    onError={() => handleImageError(course.id)}
                  />
                )}

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
          );
        })}
      </div>
    </section>
  );
}