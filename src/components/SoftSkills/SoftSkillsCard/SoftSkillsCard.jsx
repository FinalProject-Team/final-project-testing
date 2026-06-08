import {
  Briefcase,
  MessageCircle,
  Users,
  Brain,
  Timer,
  Play,
  Clock,
  Star,
  Lock,
  Award,
} from "lucide-react";

import SoftSkillsProgress from "../SoftSkillsProgress/SoftSkillsProgress";
import styles from "./SoftSkillsCard.module.css";

const icons = {
  1: Briefcase,
  2: MessageCircle,
  3: Users,
  4: Brain,
  5: Timer,
};

function SoftSkillsCard({ course, activeCourse, setActiveCourse }) {
  const isActive = activeCourse === course.id;

  const Icon = course.locked
    ? Lock
    : icons[course.id] || Briefcase;

  const handleClick = () => {
    if (!course.locked) {
      setActiveCourse(isActive ? null : course.id);
    }
  };

  return (
    <div className="col-12 col-lg-6">
     <div
  className={`${styles.courseCard} ${
    course.locked ? styles.lockedCard : ""
  }`}
  onClick={handleClick}
  style={{
    "--course-color": course.color,
  }}
>

        <div className={styles.courseHeader}>
          <div
            className={styles.courseIcon}
            style={{ background: `${course.color}20` }}
          >
            <Icon
              size={22}
              style={{
                color: course.color,
              }}
            />
          </div>

          <div className={styles.courseContent}>
            <h3>{course.title}</h3>
            <p>{course.subtitle}</p>

            <div className={styles.courseDetails}>
              <span>
                <Play size={12} /> {course.lessons} lessons
              </span>

              <span>
                <Clock size={12} /> {course.duration}
              </span>

              <span>
                <Star size={12} /> {course.rating}
              </span>
            </div>
          </div>
        </div>

        {course.progress > 0 && (
          <SoftSkillsProgress
            progress={course.progress}
            color={course.color}
          />
        )}

        <div className={styles.tags}>
          {course.tags.map((tag, index) => (
            <span key={index}>{tag}</span>
          ))}
        </div>

        {isActive && (
          <div className={styles.expanded}>
            <p>{course.description}</p>

            <div className={styles.footer}>
              <button>
                {course.progress > 0
                  ? "Continue"
                  : "Start Course"}
              </button>

              <div className={styles.xp}>
                <Award size={14} />
                <span>+{course.xp} XP</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SoftSkillsCard;