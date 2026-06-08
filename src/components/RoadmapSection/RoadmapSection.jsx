import { useState } from "react";
import styles from "./RoadmapSection.module.css";
import { FaChevronDown, FaLock } from "react-icons/fa";

export default function RoadmapSection({ course }) {
  const [openLesson, setOpenLesson] = useState(null);

  const lessons = course?.lessons || [];
  const isPurchased = Boolean(course?.isPurchased);

  const getEmbedUrl = (url) => {
    if (!url) return "";

    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }

    return url;
  };

  const toggleLesson = (lessonId, isLocked) => {
    if (isLocked) return;

    setOpenLesson((current) =>
      current === lessonId ? null : lessonId
    );
  };

  if (lessons.length === 0) {
    return (
      <div className={styles.roadmap}>
        <h2 className={styles.title}>Course Roadmap</h2>
        <p>No lessons available yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.roadmap}>
      <h2 className={styles.title}>Course Roadmap</h2>

      <div className={styles.timeline}>
        {lessons.map((lesson, index) => {
          const isFirstLesson = index === 0;
          const isLocked = !isFirstLesson && !isPurchased;

          return (
            <div key={lesson.id} className={styles.lessonWrapper}>
              {index !== lessons.length - 1 && (
                <div className={styles.line}></div>
              )}

              <div className={styles.dot}></div>

              <div
                className={`${styles.lessonCard} ${
                  isLocked ? styles.locked : ""
                }`}
                onClick={() => toggleLesson(lesson.id, isLocked)}
              >
                <div className={styles.lessonHeader}>
                  <div className={styles.lessonLeft}>
                    <div className={styles.number}>{index + 1}</div>

                    <div>
                      <h3>{lesson.title}</h3>
                      <p>{lesson.duration}</p>
                    </div>
                  </div>

                  <div className={styles.lessonRight}>
                    {isFirstLesson || isPurchased ? (
                      <span className={styles.badge}>
                        {isFirstLesson ? "Free Preview" : "Unlocked"}
                      </span>
                    ) : (
                      <span className={styles.lockBadge}>
                        <FaLock />
                        Locked
                      </span>
                    )}

                    <FaChevronDown
                      className={
                        openLesson === lesson.id ? styles.rotate : ""
                      }
                    />
                  </div>
                </div>

                {openLesson === lesson.id && !isLocked && (
                  <div className={styles.videoBox}>
                    <iframe
                      src={getEmbedUrl(lesson.video_url || lesson.videoUrl)}
                      title={lesson.title}
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}