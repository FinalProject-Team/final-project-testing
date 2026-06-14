import styles from './DailyLearningHours.module.css';

const defaultData = [
  { day: 'Mon', height: '40px' }, { day: 'Tue', height: '70px' },
  { day: 'Wed', height: '50px' }, { day: 'Thu', height: '110px' },
  { day: 'Fri', height: '60px' }, { day: 'Sat', height: '90px' },
  { day: 'Sun', height: '70px' },
];

export default function DailyLearningHours({ data: apiData }) {
  const chartData = apiData 
    ? apiData.map(d => ({ day: d.day, height: `${Math.max(10, (d.hours ?? 0) * 25)}px` }))
    : defaultData;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Daily Learning Hours (Last Week)</h3>
      <div className={styles.chart}>
        {chartData.map((item) => (
          <div key={item.day} className={styles.barGroup}>
            <div className={styles.bar} style={{ height: item.height }} />
            <span className={styles.label}>{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}