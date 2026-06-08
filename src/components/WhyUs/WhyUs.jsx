import { Code2, Building2, TrendingUp, Users, Award, Globe } from 'lucide-react';
import styles from './WhyUs.module.css';

export default function WhyUs() {
  const features = [
    {
      icon: Code2,
      title: 'AI-Powered Roadmap',
      description: 'Our AI analyzes your skills and creates a personalized learning path tailored to your career goals.'
    },
    {
      icon: Building2,
      title: 'Real Job Matching',
      description: 'Connect directly with top companies hiring for exactly your skill set, with verified salary data.'
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      description: 'Track every skill, XP point, and milestone. See your growth in real-time with detailed analytics.'
    },
    {
      icon: Users,
      title: 'Expert Instructors',
      description: 'Learn from senior engineers and designers at Google, Meta, Stripe, and other top companies.'
    },
    {
      icon: Award,
      title: 'Industry Certificates',
      description: 'Earn verified certificates recognized by 500+ hiring partners across the tech industry.'
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Join a community of 50,000+ learners worldwide with live cohorts, mentorship, and peer projects.'
    }
  ];

  return (
    <section className={styles.whyUs} id="about">
      <div className={styles.header}>
        <span className={styles.badgeSmall}>Why CareerTech</span>
        <h2 className={styles.title}>
          Built for the <span className={styles.gradient}>Future of Work</span>
        </h2>
      </div>

      <div className={styles.grid}>
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className={styles.card}>
              <div className={styles.iconWrapper}>
                <Icon size={28} />
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
