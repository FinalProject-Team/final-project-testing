import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import styles from './CourseCompletion.module.css';

const data = [
  { name: 'Completed', value: 12, color: '#0ea5e9' },
  { name: 'In Progress', value: 6, color: '#a855f7' },
  { name: 'Not Started', value: 10, color: '#334155' },
];

const CourseCompletion = () => {
  return (
    <div className={styles.chartContainer}>
      <h2 className={styles.chartTitle}>Course Completion</h2>
      
      <div className={styles.contentLayout}>
     
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: '#334155', 
                  borderRadius: '8px', 
                  color: '#fff',
                  fontSize: '12px' 
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    className={styles.pieSlice}
                    style={{ outline: 'none', cursor: 'pointer' }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        
        <div className={styles.legendContainer}>
          {data.map((item, index) => (
            <div key={index} className={styles.legendItem}>
              <div className={styles.legendLeft}>
                <span className={styles.dot} style={{ backgroundColor: item.color }}></span>
                <span className={styles.legendName}>{item.name}</span>
              </div>
              <span className={styles.legendValue}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseCompletion;