import React, { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, Plus, X } from 'lucide-react';
import styles from './AdminCourses.module.css';

import { supabase } from '../../components/layout/services/supabaseClient'; 

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    instructor: '' 
  });

  // 🔄 جلب الكورسات مباشرة من داتابيز سوبابيز
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      if (data) setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // 💾 حفظ الكورس مباشرة في الداتابيز
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        price: Number(formData.price),
        description: formData.description || '',
        instructor: formData.instructor || 'System Admin' 
      };

      if (isEditing) {
        // تحديث في سوبابيز
        const { error } = await supabase
          .from('courses')
          .update(payload)
          .eq('id', currentCourseId);

        if (error) throw error;

        setCourses(prevCourses => 
          prevCourses.map(c => c.id === currentCourseId ? { ...c, ...payload } : c)
        );
      } else {
        // إضافة كورس جديد مباشرة في سوبابيز
        const { data, error } = await supabase
          .from('courses')
          .insert([payload])
          .select();

        if (error) throw error;

        if (data && data[0]) {
          setCourses(prevCourses => [data[0], ...prevCourses]);
        }
      }
      
      closeModal();
    } catch (error) {
      console.error('Error saving course:', error.message);
      alert('⚠️ حصل مشكلة أثناء الحفظ في Supabase: ' + error.message);
    }
  };

  // 🗑️ دالة حذف الكورس المصلحة لـ UUID بدون تحويل الرقم
const confirmDelete = async () => {
    if (!courseToDelete) return;
    try {
      // طلبنا من سوبابيز يرجع لنا الداتا اللي اتحذفت عشان نتأكد إنها اتمسحت فعلياً
      const { data, error, count } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseToDelete.id)
        .select(); // 👈 الـ select هنا بتجبره يرجع السطر اللي اتمسح

      if (error) throw error;

      // 🔍 اختبار الأمان: لو الـ data راجعة فاضية، يبقى الـ RLS أو الداتابيز منعت الحذف في الحقيقة!
      if (!data || data.length === 0) {
        console.log("Supabase returned empty array. Rows deleted: 0");
        alert("⚠️ سوبابيز رفض الحذف الفعلي! غالباً بسبب حماية الـ RLS جوة داشبورد Supabase لجدول courses.");
        return; 
      }

      console.log("Successfully deleted from Supabase:", data);

      // لو تمام، احذف محلياً وقفل المودال
      setCourses(courses.filter(course => course.id !== courseToDelete.id));
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting course:', error.message);
      alert('⚠️ فشل الحذف من قاعدة البيانات: ' + error.message);
    }
  };
  
  const openDeleteModal = (course) => {
    setCourseToDelete(course);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setCourseToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const openEditModal = (course) => {
    setIsEditing(true);
    setCurrentCourseId(course.id);
    setFormData({
      title: course.title || '',
      price: course.price || '',
      description: course.description || '',
      instructor: course.instructor || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentCourseId(null);
    setFormData({ title: '', price: '', description: '', instructor: '' });
  };

  const filteredCourses = courses.filter((course) => {
    const title = course.title || '';
    const instructor = course.instructor || 'N/A';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          instructor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading Courses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.coursesContainer}>
      <div className={styles.headerSection}>
        <div>
          <h2 className={styles.title}>Courses Management</h2>
          <p className={styles.subtitle}>Manage all courses on the platform.</p>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.searchRow}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={18} />
            <input 
              type="text" 
              placeholder="Search courses by title or instructor..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className={styles.addBtnInRow} onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Add New Course
          </button>
        </div>

        <div className="table-responsive">
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th className={styles.thCourse}>Course</th>
                <th className={styles.thInstructor}>Instructor</th>
                <th className={styles.thPrice}>Price</th>
                <th className={styles.thCreated}>Created At</th>
                <th className={styles.thActions}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="5" className={styles.noData}>No courses found</td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course.id} className={styles.tableRow}>
                    <td className="py-3 fw-medium text-dark">{course.title}</td>
                    <td className="py-3 text-secondary">{course.instructor || 'Not Assigned'}</td>
                    <td className="py-3 fw-semibold text-info">{course.price ? `$${course.price}` : 'Free'}</td>
                    <td className="py-3 text-secondary">
                      {course.created_at ? new Date(course.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </td>
                    <td className="py-3 text-end">
                      <button className="btn btn-link text-primary p-1 me-2" title="Edit Course" onClick={() => openEditModal(course)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn btn-link text-danger p-1" title="Delete Course" onClick={() => openDeleteModal(course)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📥 مودال الإضافة والتعديل */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalDialog}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h5 className={styles.modalTitle}>{isEditing ? '✏️ Edit Course Specs' : '🚀 Add New Course'}</h5>
                <button type="button" className={styles.closeBtn} onClick={closeModal}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={(e) => e.preventDefault()}> 
                <div className={styles.modalBody}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Course Title</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Instructor Name</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" value={formData.instructor} onChange={(e) => setFormData({...formData, instructor: e.target.value})} placeholder="e.g. Dr. John Doe (Optional)" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Price ($)</label>
                    <input type="number" className="form-control bg-dark text-white border-secondary" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Description</label>
                    <textarea className="form-control bg-dark text-white border-secondary" rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Enter course description..."></textarea>
                  </div>
                </div>
                <div className={styles.modalFooter}>
                  <button type="button" className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                  <button type="button" className={styles.saveBtn} onClick={handleSave}>Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 🗑️ مودال تأكيد الحذف */}
      {isDeleteModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalDialogSmall}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeaderDelete}>
                <h5 className={styles.modalTitleDelete}>⚠️ Confirm Delete</h5>
                <button type="button" className={styles.closeBtn} onClick={closeDeleteModal}>
                  <X size={20} />
                </button>
              </div>
              <div className={styles.modalBodyDelete}>
                <p>Are you sure you want to permanently delete this course?</p>
                <strong className="text-info">{courseToDelete?.title}</strong>
              </div>
              <div className={styles.modalFooterDelete}>
                <button type="button" className={styles.cancelBtn} onClick={closeDeleteModal}>Cancel</button>
                <button type="button" className={styles.confirmDeleteBtn} onClick={confirmDelete}>Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}