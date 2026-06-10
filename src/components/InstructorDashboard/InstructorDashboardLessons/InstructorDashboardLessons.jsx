import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  X,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import axios from "axios";
import styles from "./InstructorDashboardLessons.module.css";
import { getCourseLessons } from "../../../services/api/instructorService";

const API_BASE_URL =
  "https://final-project-backend-production-214a.up.railway.app";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

function InstructorDashboardLessons() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openCourseId, setOpenCourseId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    video_url: "",
    lesson_order: "",
  });

  // ================= FETCH DATA =================
  const fetchCoursesWithLessons = async () => {
    try {
      setLoading(true);

      // 1. get courses
      const coursesRes = await axios.get(
        `${API_BASE_URL}/api/instructor/courses`,
        getAuthHeaders()
      );

      const coursesData = coursesRes.data || [];
      const fullData = await Promise.all(
        coursesData.map(async (course) => {

          console.log("COURSE OBJECT:", course);
          console.log("COURSE ID:", course.id);
          console.log("ALL KEYS:", Object.keys(course));

          const lessonsRes = await axios.get(
            `${API_BASE_URL}/api/lessons/instructor/course/${course.id}`,
            getAuthHeaders()
          );

          return {
            ...course,
            lessons: lessonsRes.data || [],
          };
        })
      );

      setCourses(fullData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesWithLessons();
  }, []);
  useEffect(() => {
    const testAPI = async () => {
      if (!courses.length) return;

      const firstCourseId = courses[0].id;

      const data = await getCourseLessons(firstCourseId);
      console.log("LESSONS DATA:", data);
    };

    testAPI();
  }, [courses]);

  // ================= SEARCH =================
  const filteredCourses = useMemo(() => {
    if (!searchTerm.trim()) return courses;

    return courses
      .map((course) => ({
        ...course,
        lessons: course.lessons.filter((lesson) =>
          lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.lessons.length > 0
      );
  }, [courses, searchTerm]);

  // ================= TOGGLE =================
  const toggleCourse = (id) => {
    setOpenCourseId(openCourseId === id ? null : id);
  };

  // ================= FORM =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= ADD LESSON =================
  const handleAddLesson = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_BASE_URL}/api/lessons`,
        {
          course_id: formData.courseId,
          title: formData.title,
          video_url: formData.video_url,
          lesson_order: Number(formData.lesson_order),
        },
        getAuthHeaders()
      );

      setIsModalOpen(false);

      setFormData({
        courseId: "",
        title: "",
        video_url: "",
        lesson_order: "",
      });

      await fetchCoursesWithLessons();
    } catch (err) {
      console.error(err);
      alert("Failed to add lesson");
    }
  };

  return (
    <section className={styles.lessons}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h1>Lessons Management</h1>
          <p>Organize and manage lessons for your courses.</p>
        </div>

        <button
          className={styles.addBtn}
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Add Lesson
        </button>
      </div>

      {/* SEARCH */}
      <div className={styles.searchBox}>
        <Search size={20} />
        <input
          type="text"
          placeholder="Search lessons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* LIST */}
      <div className={styles.courseList}>
        {filteredCourses.map((course) => (
          <div className={styles.courseCard} key={course.id}>
            <button
              className={styles.courseHeader}
              onClick={() => toggleCourse(course.id)}
            >
              <div className={styles.courseTitle}>
                <ChevronDown size={20} />
                <h2>{course.title}</h2>
                <span>{course.lessons.length} lessons</span>
              </div>

              <MoreVertical size={20} />
            </button>

            {openCourseId === course.id && (
              <div className={styles.lessonsList}>
                {course.lessons.map((lesson) => (
                  <div className={styles.lessonItem} key={lesson.id}>
                    <div className={styles.orderCircle}>
                      {lesson.lesson_order}
                    </div>

                    <div className={styles.lessonInfo}>
                      <h3>{lesson.title}</h3>
                      <p>{lesson.video_url}</p>
                    </div>

                    <div className={styles.actions}>
                      <button>
                        <Edit size={17} />
                      </button>
                      <button>
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button
              className={styles.closeBtn}
              onClick={() => setIsModalOpen(false)}
            >
              <X size={22} />
            </button>

            <h2>Add New Lesson</h2>

            <form onSubmit={handleAddLesson} className={styles.form}>
              <label>Course</label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                required
              >
                <option value="">Select course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>

              <label>Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <label>Video URL</label>
              <input
                name="video_url"
                value={formData.video_url}
                onChange={handleChange}
                required
              />

              <label>Order</label>
              <input
                name="lesson_order"
                type="number"
                value={formData.lesson_order}
                onChange={handleChange}
                required
              />

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>

                <button type="submit">Add Lesson</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default InstructorDashboardLessons;