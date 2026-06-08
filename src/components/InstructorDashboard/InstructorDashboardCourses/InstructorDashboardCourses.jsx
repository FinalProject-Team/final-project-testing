import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Edit, Trash2, X } from "lucide-react";
import { getInstructorCourses } from "../../../services/api/instructorService";
import styles from "./InstructorDashboardCourses.module.css";

function InstructorDashboardCourses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    level: "",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        const response = await getInstructorCourses();

        setCourses(response || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const value = searchTerm.toLowerCase();

      return (
        (course.title || "").toLowerCase().includes(value) ||
        (course.description || "").toLowerCase().includes(value)
      );
    });
  }, [courses, searchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateCourse = (e) => {
    e.preventDefault();

    const newCourse = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      level: formData.level,
    };

    setCourses((prev) => [newCourse, ...prev]);

    setFormData({
      title: "",
      description: "",
      price: "",
      category: "",
      level: "",
    });

    setIsModalOpen(false);
  };

  const handleDeleteCourse = (courseId) => {
    setCourses((prev) =>
      prev.filter((course) => course.id !== courseId)
    );
  };

  return (
    <section className={styles.courses}>
      <div className={styles.header}>
        <div>
          <h1>Courses Management</h1>
          <p>Manage your courses and track their performance.</p>
        </div>

        <button
          className={styles.addBtn}
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Create Course
        </button>
      </div>

      <div className={styles.searchBox}>
        <Search size={20} />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && (
        <div className={styles.message}>Loading courses...</div>
      )}

      {error && (
        <div className={styles.error}>{error}</div>
      )}

      {!loading && !error && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Course Title</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course.id}>
                  <td>
                    <strong>{course.title}</strong>
                    <span>{course.description}</span>
                  </td>

                  <td>${course.price}</td>

                  <td>
                    <div className={styles.actions}>
                      <button>
                        <Edit size={17} />
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteCourse(course.id)
                        }
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button
              className={styles.closeBtn}
              onClick={() => setIsModalOpen(false)}
            >
              <X size={22} />
            </button>

            <h2>Create New Course</h2>
            <p>Add a new course to your catalog.</p>

            <form
              className={styles.form}
              onSubmit={handleCreateCourse}
            >
              <label>Course Title</label>

              <input
                type="text"
                name="title"
                placeholder="Enter course title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <label>Description</label>

              <textarea
                name="description"
                placeholder="Enter course description"
                value={formData.description}
                onChange={handleChange}
                required
              />

              <label>Price ($)</label>

              <input
                type="number"
                name="price"
                placeholder="99.99"
                value={formData.price}
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

                <button
                  type="submit"
                  className={styles.submitBtn}
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default InstructorDashboardCourses;