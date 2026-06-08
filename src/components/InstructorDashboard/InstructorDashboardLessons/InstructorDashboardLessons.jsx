import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  X,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import styles from "./InstructorDashboardLessons.module.css";

function InstructorDashboardLessons() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openCourseId, setOpenCourseId] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "React Masterclass",
      lessons: [
        {
          id: 1,
          title: "Introduction to React",
          video_url: "https://example.com/video1",
          lesson_order: 1,
        },
        {
          id: 2,
          title: "Understanding Components",
          video_url: "https://example.com/video2",
          lesson_order: 2,
        },
        {
          id: 3,
          title: "State and Props",
          video_url: "https://example.com/video3",
          lesson_order: 3,
        },
      ],
    },
    {
      id: 2,
      title: "JavaScript Fundamentals",
      lessons: [
        {
          id: 4,
          title: "Variables and Data Types",
          video_url: "https://example.com/video4",
          lesson_order: 1,
        },
        {
          id: 5,
          title: "Functions and Scope",
          video_url: "https://example.com/video5",
          lesson_order: 2,
        },
      ],
    },
  ]);

  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    video_url: "",
    lesson_order: "",
  });

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

  const toggleCourse = (courseId) => {
    setOpenCourseId(openCourseId === courseId ? null : courseId);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddLesson = (e) => {
    e.preventDefault();

    const newLesson = {
      id: Date.now(),
      title: formData.title,
      video_url: formData.video_url,
      lesson_order: Number(formData.lesson_order),
    };

    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === Number(formData.courseId)
          ? {
              ...course,
              lessons: [...course.lessons, newLesson].sort(
                (a, b) => a.lesson_order - b.lesson_order
              ),
            }
          : course
      )
    );

    setFormData({
      courseId: "",
      title: "",
      video_url: "",
      lesson_order: "",
    });

    setIsModalOpen(false);
  };

  return (
    <section className={styles.lessons}>
      <div className={styles.header}>
        <div>
          <h1>Lessons Management</h1>
          <p>Organize and manage lessons for your courses.</p>
        </div>

        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Add Lesson
        </button>
      </div>

      <div className={styles.searchBox}>
        <Search size={20} />
        <input
          type="text"
          placeholder="Search lessons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.courseList}>
        {filteredCourses.map((course) => (
          <div className={styles.courseCard} key={course.id}>
            <button
              className={styles.courseHeader}
              onClick={() => toggleCourse(course.id)}
            >
              <div className={styles.courseTitle}>
                <ChevronDown
                  size={20}
                  className={
                    openCourseId === course.id ? styles.rotate : styles.chevron
                  }
                />
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
            <p>Create a new lesson for your course.</p>

            <form onSubmit={handleAddLesson} className={styles.form}>
              <label>Course</label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                required
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>

              <label>Lesson Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter lesson title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <label>Video URL</label>
              <input
                type="url"
                name="video_url"
                placeholder="https://example.com/video"
                value={formData.video_url}
                onChange={handleChange}
                required
              />

              <label>Lesson Order</label>
              <input
                type="number"
                name="lesson_order"
                placeholder="1"
                value={formData.lesson_order}
                onChange={handleChange}
                required
              />

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>

                <button type="submit" className={styles.submitBtn}>
                  Add Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default InstructorDashboardLessons;