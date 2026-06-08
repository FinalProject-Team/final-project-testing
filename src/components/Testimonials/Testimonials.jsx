import { Star } from 'lucide-react';
import styles from './Testimonials.module.css';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "CareerTech's AI roadmap was spot-on. I went from zero to landing a $170k job in 8 months. The structure and job matching are unreal.",
      author: 'Marcus Rivera',
      role: 'Frontend Dev @ Shopify',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    {
      quote: "The UI/UX track was comprehensive and beautifully structured. The Career Twin feature helped me visualize exactly where I'm headed.",
      author: 'Aisha Okonkwo',
      role: 'UX Designer @ Spotify',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    },
    {
      quote: "The AI & ML track is world-class. The instructors are actual researchers and the projects go into your portfolio immediately.",
      author: 'David Kim',
      role: 'ML Engineer @ Tesla',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
    }
  ];

  return (
    <section className={styles.testimonials}>
      <div className={styles.header}>
        <h2 className={styles.title}>Students Who <span className={styles.gradient}>Made It</span></h2>
      </div>

      <div className={styles.grid}>
        {testimonials.map((testimonial, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={styles.star} />
              ))}
            </div>

            <p className={styles.quote}>"{testimonial.quote}"</p>

            <div className={styles.author}>
              <img src={testimonial.image} alt={testimonial.author} className={styles.avatar} />
              <div>
                <div className={styles.authorName}>{testimonial.author}</div>
                <div className={styles.authorRole}>{testimonial.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
