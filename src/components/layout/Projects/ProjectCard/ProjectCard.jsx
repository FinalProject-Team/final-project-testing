import styles from './ProjectCard.module.css';
import StatusBadge from '../StatusBadge/StatusBadge';
import ProgressBar from '../ProgressBar/ProgressBar';
import ProjectActions from '../ProjectActions/ProjectActions';
import { getTechColor } from '../../../../utils/helpers';

const CATEGORY_ICONS = {
  'Full Stack': '◫', Frontend: '◱', 'AI/ML': '◈', Data: '◉', Backend: '◧',
};

// Curated placeholder images per category when API returns no image
const FALLBACK_IMAGES = {
  'Full Stack':             'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=220&fit=crop',
  'Full Stack Projects':    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=220&fit=crop',
  Frontend:                 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=220&fit=crop',
  Backend:                  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=220&fit=crop',
  'AI/ML':                  'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=220&fit=crop',
  Data:                     'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=220&fit=crop',
  'Web Projects':           'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=220&fit=crop',
  'JavaScript && OOP':      'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&h=220&fit=crop',
  default:                  'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=220&fit=crop',
};

export default function ProjectCard({ project, index = 0 }) {
 const {
  title,
  description,
  status,
  progress,
  techStack,
  image,
  github_link,
  live_demo,
  category,
  stars
} = project;

  const displayImage = image || FALLBACK_IMAGES[category] || FALLBACK_IMAGES.default;

  // Called when the resolved image URL itself 404s or fails to load
  const handleImgError = (e) => {
    const fallback = FALLBACK_IMAGES[category] || FALLBACK_IMAGES.default;
    if (e.target.src !== fallback) {
      e.target.src = fallback;
    }
  };

  return (
    <article className={styles.card} style={{ animationDelay: `${index * 70}ms` }}>
      <div className={styles.imageWrapper}>
        <>
          <img src={displayImage} alt={title} className={styles.image} loading="lazy" onError={handleImgError} />
          <div className={styles.imageOverlay} />
        </>
        <div className={styles.badgeWrap}><StatusBadge status={status} /></div>
        {category && (
          <div className={styles.categoryTag}>
            {CATEGORY_ICONS[category] || '●'} {category}
          </div>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{title}</h3>
          {stars > 0 && (
            <span className={styles.stars}>
              <span className={styles.starsIcon}>★</span>{stars}
            </span>
          )}
        </div>

        <p className={styles.description}>{description}</p>

        <div className={styles.techStack}>
          <div className={styles.techStack}>
  {techStack?.map(tech => (
    <span key={tech} className={styles.techTag}>
      <span
        className={styles.techDot}
        style={{ background: getTechColor(tech) }}
      />
      {tech}
    </span>
  ))}
</div>
          <div className={styles.techStack}>
  {techStack?.map(tech => (
    <span key={tech} className={styles.techTag}>
      <span
        className={styles.techDot}
        style={{ background: getTechColor(tech) }}
      />
      {tech}
    </span>
  ))}
</div><div className={styles.techStack}>
 <div className={styles.techStack}>
  {techStack?.map(tech => (
    <span key={tech} className={styles.techTag}>
      <span
        className={styles.techDot}
        style={{ background: getTechColor(tech) }}
      />
      {tech}
    </span>
  ))}
</div>
</div>
        </div>

        <div className={styles.footer}>
          <div className={styles.divider} />
          <ProgressBar progress={progress} status={status} />
         <ProjectActions
  githubUrl={github_link}
  liveUrl={live_demo}
/>
        </div>
      </div>
    </article>
  );
}
