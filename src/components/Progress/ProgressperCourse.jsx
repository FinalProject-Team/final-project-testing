import styles from './ProgressperCourse.module.css';

const courses = [
  { name: 'HTML & CSS', value: 100, color: '#2ecc71' },
  { name: 'JavaScript', value: 85, color: '#3498db' },
  { name: 'React', value: 62, color: '#00d8ff' },
  { name: 'TypeScript', value: 30, color: '#9b59b6' },
  { name: 'Git', value: 90, color: '#f39c12' },
  { name: 'APIs', value: 45, color: '#e74c3c' },
];

export default function ProgressperCourse() {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Progress per Course</h3>
      {courses.map((course) => (
        <div key={course.name} className={styles.item}>
          <div className={styles.labelRow}>
            <span>{course.name}</span>
            <span style={{ color: course.color }}>{course.value}%</span>
          </div>
          <div className={styles.track}>
            <div 
              className={styles.progress} 
              style={{ width: `${course.value}%`, backgroundColor: course.color }} 
            />
          </div>
        </div>
      ))}
    </div>
  );
}