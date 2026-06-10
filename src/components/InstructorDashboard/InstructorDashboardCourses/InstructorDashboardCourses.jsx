import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Edit, Trash2, X } from "lucide-react";
import {
  getInstructorCourses,
  createCourse,
  deleteCourse,
  updateCourse
} from "../../../services/api/instructorService";

import styles from "./InstructorDashboardCourses.module.css";

function InstructorDashboardCourses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    level: "",
  });

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

  useEffect(() => {
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

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      category: "",
      level: "",
    });
    setEditingCourse(null);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    try {
      await createCourse(formData);

      resetForm();
      setIsModalOpen(false);

      await fetchCourses();
    } catch (err) {
      console.error(err);
      alert("Failed to create course");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteCourse(courseId);
      await fetchCourses();
    } catch (err) {
      console.error(err);
      alert("Failed to delete course");
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        title: formData.title || editingCourse.title,
        description: formData.description || editingCourse.description,
        price: formData.price || editingCourse.price,
        category: formData.category || editingCourse.category,
        level: formData.level || editingCourse.level,
      };

      await updateCourse(editingCourse.id, payload);

      resetForm();
      setIsModalOpen(false);

      await fetchCourses();
    } catch (err) {
      console.error(err);
      alert("Failed to update course");
    }
  };

  return (
    <section className={styles.courses}>

      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h1>Courses Management</h1>
          <p>Manage your courses and track their performance.</p>
        </div>

        <button
          className={styles.addBtn}
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
        >
          <Plus size={18} />
          Create Course
        </button>
      </div>

      {/* SEARCH */}
      <div className={styles.searchBox}>
        <Search size={20} />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* LOADING / ERROR */}
      {loading && <div className={styles.message}>Loading courses...</div>}
      {error && <div className={styles.error}>{error}</div>}

      {/* TABLE */}
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

                      <button
                        onClick={() => {
                          setEditingCourse(course);
                          setFormData({
                            title: course.title || "",
                            description: course.description || "",
                            price: course.price || "",
                            category: course.category || "",
                            level: course.level || "",
                          });
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit size={17} />
                      </button>

                      <button onClick={() => handleDeleteCourse(course.id)}>
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

      {/* MODAL */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>

            <button
              className={styles.closeBtn}
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              <X size={22} />
            </button>

            <h2>
              {editingCourse ? "Update Course" : "Create New Course"}
            </h2>

            <p>Add a new course to your catalog.</p>

            <form
              className={styles.form}
              onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}
            >

              <label>Course Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required={!editingCourse}
              />

              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required={!editingCourse}
              />

              <label>Price ($)</label>
              <input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required={!editingCourse}
              />

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>

                <button type="submit" className={styles.submitBtn}>
                  {editingCourse ? "Update Course" : "Create Course"}
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