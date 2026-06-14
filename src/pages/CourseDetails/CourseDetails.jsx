import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../../components/Header/Header";
import InstructorCard from "../../components/InstructorCard/InstructorCard";
import StatsCards from "../../components/StatsCards/StatsCards";
import RoadmapSection from "../../components/RoadmapSection/RoadmapSection";
import PriceCard from "../../components/PriceCard/PriceCard";
import { apiGetCourseById, apiGetCourseLessons } from "../../services/api/api";

import styles from "./CourseDetails.module.css";

export default function CourseDetails() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);

        const courseData = await apiGetCourseById(id);

        let lessonsData = [];

        try {
          const lessonsRes = await apiGetCourseLessons(id);
          lessonsData = Array.isArray(lessonsRes) ? lessonsRes : lessonsRes?.lessons || [];
        } catch {
          if (courseData?.video_preview) {
            lessonsData = [
              {
                id: "preview",
                title: "Free Preview",
                video_url: courseData.video_preview,
                lesson_order: 1,
                duration: "Preview",
              },
            ];
          }
        }

        setCourse({
          ...courseData,
          lessons: lessonsData,
          isPurchased: false,
        });
      } catch (error) {
        console.error("Error loading course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  if (loading) {
    return <h2 className={styles.loading}>Loading...</h2>;
  }

  if (!course) {
    return <h2 className={styles.loading}>Course Not Found</h2>;
  }

  return (
    <div className={styles.page}>
      <Header course={course} />

      <div className={styles.contentWrapper}>
        <div className={styles.leftSection}>
          <InstructorCard course={course} />

          <StatsCards course={course} />

          <RoadmapSection course={course} />
        </div>

        <div className={styles.rightSection}>
          <PriceCard course={course} />
        </div>
      </div>
    </div>
  );
}
