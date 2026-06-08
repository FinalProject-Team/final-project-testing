import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import styles from './XPGrowth.module.css';

const data = [
  { name: 'W1', xp: 120 },
  { name: 'W2', xp: 210 },
  { name: 'W3', xp: 160 },
  { name: 'W4', xp: 290 },
  { name: 'W5', xp: 220 },
  { name: 'W6', xp: 340 },
  { name: 'W7', xp: 280 },
  { name: 'W8', xp: 410 },
];

const XPGrowth = () => {
  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <h2 className={styles.chartTitle}>XP Growth (8 weeks)</h2>
        <span className={styles.growthBadge}>+156% total growth</span>
      </div>
      
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {/* التدرج اللوني المضيء أسفل المنحنى */}
              <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#4b5563', fontSize: 13, fontWeight: 500 }}
              dy={10}
            />
            <YAxis hide={true} domain={[0, 'dataMax + 50']} />
            
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
              labelStyle={{ color: '#94a3b8' }}
            />
            
            <Area 
              type="monotone" 
              dataKey="xp" 
              stroke="#38bdf8" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#xpGradient)"
              dot={{ r: 4, fill: '#38bdf8', strokeWidth: 2, stroke: '#0f172a' }}
              activeDot={{ r: 6, fill: '#38bdf8' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default XPGrowth;