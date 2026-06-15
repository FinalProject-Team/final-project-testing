import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import { useOutletContext } from 'react-router-dom'; // 👈 1. استدعينا الـ Context هنا
import styles from './AdminLessons.module.css';

import {
  apiGetAllCourses,
  apiGetLessonsForCourse,
  apiCreateLesson,
  apiUpdateLesson,
  apiDeleteLesson,
} from '../../services/api/api';

export default function AdminLessons() {
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');

  // 👈 2. لقطنا الـ searchQuery اللي بيكتبها المستخدم في الـ Topbar فوق
  const { searchQuery } = useOutletContext(); 

  // ستيتس المودالات والتحكم
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // ستيتس بيانات الفورم
  const [formData, setFormData] = useState({
    title: '',
    course_id: '',
    video_url: '',
    lesson_order: ''
  });

  // 🔄 Fetch courses and their lessons from the backend API
  const fetchData = async () => {
    try {
      setLoading(true);

      const coursesData = await apiGetAllCourses();
      const coursesList = Array.isArray(coursesData)
        ? coursesData
        : (coursesData?.courses || coursesData?.data || []);
      setCourses(coursesList);

      // The API only exposes lessons per-course, so combine them here.
      const allLessons = [];
      for (const course of coursesList) {
        try {
          const lessonsRes = await apiGetLessonsForCourse(course.id);
          const lessonsList = Array.isArray(lessonsRes)
            ? lessonsRes
            : (lessonsRes?.lessons || lessonsRes?.data || []);
          lessonsList.forEach((lesson) => {
            allLessons.push({ ...lesson, course_id: lesson.course_id || course.id });
          });
        } catch (err) {
          // A single course's lessons failing to load shouldn't break the whole page
          console.warn(`Could not load lessons for course ${course.id}:`, err.message);
        }
      }
      setLessons(allLessons);

    } catch (error) {
      console.error('Error fetching data:', error.message);
      alert('⚠️ Error loading data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 💾 Save or update a lesson via the backend Lessons API
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!formData.course_id) {
      alert('⚠️ Please select a course first!');
      return;
    }

    try {
      const payload = {
        title: formData.title,
        course_id: formData.course_id,
        video_url: formData.video_url || '',
        lesson_order: formData.lesson_order ? Number(formData.lesson_order) : 0,
      };

      if (isEditing) {
        await apiUpdateLesson(currentLessonId, payload);
        setLessons(prev => prev.map(l => l.id === currentLessonId ? { ...l, ...payload } : l));
      } else {
        const created = await apiCreateLesson(payload);
        const newLesson = created?.lesson || created?.data || created;

        if (newLesson) {
          setLessons(prev => [...prev, newLesson]);
        } else {
          await fetchData();
        }
      }

      closeModal();
    } catch (error) {
      console.error('Error saving lesson:', error.message);
      alert('⚠️ Failed to save the lesson: ' + (error?.response?.data?.message || error.message));
    }
  };

  const confirmDelete = async () => {
    if (!lessonToDelete) return;
    try {
      await apiDeleteLesson(lessonToDelete.id);

      setLessons(prev => prev.filter(l => l.id !== lessonToDelete.id));
      closeDeleteModal();

    } catch (error) {
      console.error('Error deleting lesson:', error.message);
      alert('⚠️ Failed to delete: ' + (error?.response?.data?.message || error.message));
    }
  };
  
  const openEditModal = (lesson) => {
    setIsEditing(true);
    setCurrentLessonId(lesson.id);
    setFormData({
      title: lesson.title || '',
      course_id: lesson.course_id || '',
      video_url: lesson.video_url || '',
      lesson_order: lesson.lesson_order ?? ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentLessonId(null);
    setFormData({ title: '', course_id: '', video_url: '', lesson_order: '' });
  };

  const openDeleteModal = (lesson) => {
    setLessonToDelete(lesson);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setLessonToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // 🔍 3. الفلترة والتصفية الذكية بناءً على الـ searchQuery اللي جاية من التوب بار
  const filteredLessons = lessons.filter((lesson) => {
    // علامة الـ ? عشان لو العنوان فيه قيمة فاضية الكود ميعملش Crash
    const matchesSearch = lesson.title?.toLowerCase().includes((searchQuery || '').toLowerCase());
    const matchesCourse = selectedCourseFilter === 'all' || lesson.course_id === selectedCourseFilter;
    return matchesSearch && matchesCourse;
  });

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading Lessons...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.lessonsContainer}>
      {/* الهيدر وزرار الإضافة */}
      <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h2 className={`h4 mb-1 ${styles.title}`}>Lessons Management</h2>
          <p className={styles.subtitle}>Manage all lessons across the platform.</p>
        </div>
        <button className={styles.addLessonBtn} onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add New Lesson
        </button>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.searchRow}>
          {/* 💡 شيلنا مربع البحث القديم من هنا لأن البحث بقا شغال فوق في الـ Topbar خلاص */}
          
          <select 
            className={styles.courseSelect}
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>
        </div>

        <div className="table-responsive">
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Lesson</th>
                <th style={{ width: '30%' }}>Course</th>
                <th style={{ width: '20%' }}>Order</th>
                <th style={{ width: '10%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* 💡 هنا بنعمل الخريطة (.map) على الـ filteredLessons المتفلترة بالبحث الفوقاني */}
              {filteredLessons.length === 0 ? (
                <tr>
                  <td colSpan="4" className={styles.noData}>No lessons found</td>
                </tr>
              ) : (
                filteredLessons.map((lesson) => {
                  const courseObj = courses.find(c => c.id === lesson.course_id);
                  return (
                    <tr key={lesson.id} className={styles.tableRow}>
                      <td className={`py-3 ${styles.lessonTitleText}`}>{lesson.title}</td>
                      <td className={`py-3 ${styles.courseTitleText}`}>{courseObj ? courseObj.title : 'Unknown Course'}</td>
                      <td className={`py-3 ${styles.durationText}`}>{lesson.lesson_order ?? '-'}</td>
                      <td className="py-3 text-end">
                        <button className="btn btn-link text-info p-1 me-2" title="Edit" onClick={() => openEditModal(lesson)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn btn-link text-danger p-1" title="Delete" onClick={() => openDeleteModal(lesson)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📥 مودال إضافة وتعديل الدرس الداكن */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h5 className={styles.modalTitle}>{isEditing ? '✏️ Edit Lesson Specs' : '🚀 Add New Lesson'}</h5>
              <button type="button" className={styles.closeBtn} onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave}> 
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Lesson Title</label>
                  <input type="text" className={styles.formInput} required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Belongs to Course</label>
                  <select className={styles.formSelect} required value={formData.course_id} onChange={(e) => setFormData({...formData, course_id: e.target.value})}>
                    <option value="" className="bg-dark">-- Select Course --</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id} className="bg-dark">{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Video URL</label>
                  <input type="text" className={styles.formInput} value={formData.video_url} onChange={(e) => setFormData({...formData, video_url: e.target.value})} placeholder="https://video.com/lesson" />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Lesson Order</label>
                  <input type="number" className={styles.formInput} value={formData.lesson_order} onChange={(e) => setFormData({...formData, lesson_order: e.target.value})} placeholder="e.g. 1" />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                <button type="submit" className={styles.saveBtn}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🗑️ مودال تأكيد الحذف الداكن المحمر للتنبيه */}
      {isDeleteModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContentDelete}>
            <div className={styles.modalHeaderDelete}>
              <h5 className={styles.modalTitleDelete}>⚠️ Confirm Delete</h5>
              <button type="button" className={styles.closeBtn} onClick={closeDeleteModal}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBodyDelete}>
              Are you sure you want to permanently delete this lesson?
              {/* 💡 ضفنا اسم الدرس بالستايل اللبني المضيء زي ما طلبنا فوق */}
              <span className={styles.deleteTargetName}>{lessonToDelete?.title}</span>
            </div>
            <div className={styles.modalFooterDelete}>
              <button type="button" className={styles.cancelBtn} onClick={closeDeleteModal}>Cancel</button>
              <button type="button" className={styles.confirmDeleteBtn} onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}