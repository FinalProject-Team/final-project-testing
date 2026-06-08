import SectionHeader from '../../components/layout/Projects/SectionHeader/SectionHeader';
import ProjectCard from '../../components/layout/Projects/ProjectCard/ProjectCard';
import EmptyState from '../../components/layout/Projects/EmptyState/EmptyState';
import styles from './Projects.module.css';

export default function PlannedProjects({ projects }) {
  return (
    <section className={styles.section}>
      <SectionHeader type="planned" title="Planned Projects" count={projects.length} />
      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className={styles.grid}>
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
