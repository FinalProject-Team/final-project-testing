import React, { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, Plus, X } from 'lucide-react';
import styles from './AdminLessons.module.css';

import { supabase } from '../../components/layout/services/supabaseClient'; 

export default function AdminLessons() {
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]); // لجلب الكورسات الحقيقية لربط الدروس بها
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');

  // ستيتس المودالات والتحكم
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // ستيتس بيانات الفورم (تمت إزالة حقل order تماماً لتجنب الأخطاء)
  const [formData, setFormData] = useState({
    title: '',
    course_id: '',
    duration: ''
  });

  // 🔄 جلب الدروس والكورسات المصلحة بدون الترتيب مع تحديد الحقول الصالحة فقط
  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. جلب الكورسات الحقيقية
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id, title');
      
      if (coursesError) throw coursesError;
      if (coursesData) setCourses(coursesData);

      // 2. جلب الدروس مع تحديد الأعمدة الفردية الصالحة لمنع استدعاء order الممسوح
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

  // 💾 2. حفظ أو تحديث الدرس مباشرة في الداتابيز
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!formData.course_id) {
      alert('⚠️ Please select a course first!');
      return;
    }

    try {
      const payload = {
        title: formData.title,
        course_id: formData.course_id, // ربط الدرس بالكورس الـ UUID
        duration: formData.duration || '0 mins'
      };

      if (isEditing) {
        // تحديث الدرس
        const { error } = await supabase
          .from('lessons')
          .update(payload)
          .eq('id', currentLessonId);

        if (error) throw error;

        setLessons(prev => prev.map(l => l.id === currentLessonId ? { ...l, ...payload } : l));
      } else {
        // إضافة درس جديد - مع تحديد الـ select لمنع إرجاع حقل الترتيب من كاش السيرفر
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
      // بنادي على select() مع count عشان نعرف السيرفر حذف كام صف بالظبط
      const { data, error, status } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonToDelete.id)
        .select(); // 👈 دي بتجبر السيرفر يرجع الداتا الممسوحة فعلياً

      if (error) throw error;

      // 🚨 هنا السر: لو الـ data راجعة فاضية، معناه إن السيرفر محذفش حاجة من الداتابيز أصلاً!
      if (!data || data.length === 0) {
        alert(`⚠️ السيرفر لم يجد درس بهذا الـ ID في الداتابيز لحذفه! \n الـ ID المرسل: ${lessonToDelete.id}`);
        return; // بنوقف هنا عشان ميمسحش من الشاشة ويخدعك
      }

      // ✅ لو وصل هنا يبقى الحذف تم فعلياً في قاعدة البيانات
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

  // 🔍 4. فلترة وتصفية الدروس بناءً على السيرش والـ Select
  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch = lesson.title?.toLowerCase().includes(searchTerm.toLowerCase());
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
      {/* الهيدر وزرار الإضافة المربوط بالـ Module */}
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
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={18} />
            <input 
              type="text" 
              placeholder="Search lessons..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

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

      {/* 📥 مودال إضافة وتعديل الدرس من الـ Module */}
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

      {/* 🗑️ مودال تأكيد الحذف من الـ Module */}
      {isDeleteModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContentDelete}>
            <div className={styles.modalHeaderDelete}>
              <h5 className={styles.modalTitleDelete}>⚠️ Confirm Delete</h5>
              <button type="button" className={styles.closeBtn} onClick={closeDeleteModal}>
                <X size={20} />
              </button>
            </div>
            <div className={`${styles.modalBody} text-center py-4`}>
              <p className="text-secondary small mb-2">Are you sure you want to permanently delete this lesson?</p>
              <h6 className="text-info fw-semibold mb-0">{lessonToDelete?.title}</h6>
            </div>
            <div className={`${styles.modalFooter} justify-content-center`}>
              <button type="button" className={styles.cancelBtn} onClick={closeDeleteModal}>Cancel</button>
              <button type="button" className={styles.confirmDeleteBtn} onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}