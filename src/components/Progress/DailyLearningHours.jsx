import styles from './DailyLearningHours.module.css';

const data = [
  { day: 'Mon', height: '40px' }, { day: 'Tue', height: '70px' },
  { day: 'Wed', height: '50px' }, { day: 'Thu', height: '110px' },
  { day: 'Fri', height: '60px' }, { day: 'Sat', height: '90px' },
  { day: 'Sun', height: '70px' },
];

export default function DailyLearningHours() {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Daily Learning Hours (Last Week)</h3>
      <div className={styles.chart}>
        {data.map((item) => (
          <div key={item.day} className={styles.barGroup}>
            <div className={styles.bar} style={{ height: item.height }} />
            <span className={styles.label}>{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}