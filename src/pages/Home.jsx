import { useEffect } from "react";

import Navbar from '../components/Navbar/Navbar';
import { useTheme } from '../context/ThemeContext';

import Hero from '../components/Hero/Hero';
import Stats from '../components/Stats/Stats';
import WhyUs from '../components/WhyUs/WhyUs';
import Courses from '../components/Courses/Courses';
import Testimonials from '../components/Testimonials/Testimonials';
import CTA from '../components/CTA/CTA';
import Footer from '../components/Footer/Footer';

export default function Home() {
  useEffect(() => {
    if (window.location.hash === "#courses") {
      setTimeout(() => {
        document
          .getElementById("courses")
          ?.scrollIntoView({ behavior: "auto" });
      }, 0);
    }
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <WhyUs />
      <Courses />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}