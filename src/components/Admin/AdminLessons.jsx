import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import { useOutletContext } from 'react-router-dom'; // 👈 1. استدعينا الـ Context هنا
import styles from './AdminLessons.module.css';

import { supabase } from '../../components/layout/services/supabaseClient'; 

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
    duration: ''
  });

  // 🔄 جلب الدروس والكورسات
  const fetchData = async () => {
    try {
      setLoading(true);

      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id, title');
      
      if (coursesError) throw coursesError;
      if (coursesData) setCourses(coursesData);

      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('id, title, course_id, duration'); 

      if (lessonsError) throw lessonsError;
      
      if (lessonsData) {
        setLessons(lessonsData);
      }

    } catch (error) {
      console.error('Error fetching data:', error.message);
      alert('⚠️ خطأ أثناء جلب البيانات: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 💾 حفظ أو تحديث الدرس
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
        duration: formData.duration || '0 mins'
      };

      if (isEditing) {
        const { error } = await supabase
          .from('lessons')
          .update(payload)
          .eq('id', currentLessonId);

        if (error) throw error;

        setLessons(prev => prev.map(l => l.id === currentLessonId ? { ...l, ...payload } : l));
      } else {
        const { data, error } = await supabase
          .from('lessons')
          .insert([payload])
          .select('id, title, course_id, duration'); 

        if (error) throw error;

        if (data && data[0]) {
          setLessons(prev => [...prev, data[0]]);
        }
      }

      closeModal();
    } catch (error) {
      console.error('Error saving lesson:', error.message);
      alert('⚠️ حصل مشكلة أثناء الحفظ في Supabase: ' + error.message);
    }
  };

  const confirmDelete = async () => {
    if (!lessonToDelete) return;
    try {
      const { data, error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonToDelete.id)
        .select(); 

      if (error) throw error;

      if (!data || data.length === 0) {
        alert(`⚠️ السيرفر لم يجد درس بهذا الـ ID في الداتابيز لحذفه! \n الـ ID المرسل: ${lessonToDelete.id}`);
        return; 
      }

      setLessons(prev => prev.filter(l => l.id !== lessonToDelete.id));
      closeDeleteModal();
      
    } catch (error) {
      console.error('Error deleting lesson:', error.message);
      alert('⚠️ فشل الحذف: ' + error.message);
    }
  };
  
  const openEditModal = (lesson) => {
    setIsEditing(true);
    setCurrentLessonId(lesson.id);
    setFormData({
      title: lesson.title || '',
      course_id: lesson.course_id || '',
      duration: lesson.duration || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentLessonId(null);
    setFormData({ title: '', course_id: '', duration: '' });
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
                <th style={{ width: '20%' }}>Duration</th>
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
                      <td className={`py-3 ${styles.durationText}`}>{lesson.duration}</td>
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
                  <label className={styles.formLabel}>Duration (e.g., "15 mins")</label>
                  <input type="text" className={styles.formInput} value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} placeholder="e.g. 20 mins" />
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