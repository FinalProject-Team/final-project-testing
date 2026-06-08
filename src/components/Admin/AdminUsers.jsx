import React, { useState, useEffect } from 'react';
import { Search, Trash2, Edit2, Check, X } from 'lucide-react';
import styles from './AdminUsers.module.css';
import api from './adminApi';

export default function AdminUsers() {
  // --- 1️⃣ تعريف الـ States ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // States خاصة بتعديل الـ Role
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  // 🚨 States جديدة مخصصة لمودال الحذف الاحترافي
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // --- 2️⃣ دالة جلب البيانات من الـ API ---
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/users');
      if (response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- 3️⃣ دالة تحديث الـ Role (PUT) ---
  const handleUpdateRole = async (userId) => {
    try {
      await api.put(`/api/admin/user/${userId}/role`, { role: selectedRole });
      setUsers(users.map(user => user.id === userId ? { ...user, role: selectedRole } : user));
      setEditingUserId(null); 
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update role. Check admin permissions.');
    }
  };

  // --- 4️⃣ دالت التحكم في مودال الحذف الحقيقي ---
  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      // الـ URL هو /api/admin/user/{id} بناءً على السواجر
      await api.delete(`/api/admin/user/${userToDelete.id}`);
      
      // إزالة المستخدم من الـ state فوراً بعد نجاح الحذف
      setUsers(users.filter(user => user.id !== userToDelete.id));
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user.');
    }
  };

  // --- 5️⃣ الفلترة والبحث (Client-side Filtering) ---
  const filteredUsers = users.filter((user) => {
    const fullName = user.full_name || '';
    const email = user.email || '';
    const role = user.role || '';

    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          email.toLowerCase().includes(searchTerm.toLowerCase());
                          
    const matchesRole = roleFilter === 'all' || role.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh', color: 'white' }}>
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading Users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.usersContainer}>
      <div className="mb-4">
        <h2 className={`h4 ${styles.title}`}>Users Management</h2>
        <p className={styles.subtitle}>Manage all users, students, and instructors on the platform.</p>
      </div>

      <div className={styles.tableCard}>
        {/* شريط البحث والفلترة */}
        <div className={styles.searchRow}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={18} />
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            className={styles.roleSelect}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="instructor">Instructors</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {/* جدول عرض البيانات الحقيقية */}
        <div className="table-responsive">
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th style={{ width: '25%' }}>User</th>
                <th style={{ width: '30%' }}>Email</th>
                <th style={{ width: '20%' }}>Role</th>
                <th style={{ width: '15%' }}>Joined</th>
                <th style={{ width: '10%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">No users found</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td className="py-3 fw-medium text-dark">{user.full_name || 'N/A'}</td>
                    <td className="py-3 text-secondary">{user.email || 'No Email'}</td>
                    
                    {/* الـ Role مع إمكانية التعديل السريع */}
                    <td className="py-3">
                      {editingUserId === user.id ? (
                        <div className="d-flex align-items-center gap-1">
                          <select 
                            className="form-select form-select-sm"
                            style={{ maxWidth: '120px', fontSize: '0.85rem' }}
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                          >
                            <option value="student">Student</option>
                            <option value="instructor">Instructor</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button className="btn btn-sm btn-success p-1 ms-1" onClick={() => handleUpdateRole(user.id)}><Check size={14} /></button>
                          <button className="btn btn-sm btn-secondary p-1" onClick={() => setEditingUserId(null)}><X size={14} /></button>
                        </div>
                      ) : (
                        <span className={`badge ${
                          user.role?.toLowerCase() === 'admin' ? 'bg-danger-subtle text-danger' :
                          user.role?.toLowerCase() === 'instructor' ? 'bg-primary-subtle text-primary' :
                          'bg-success-subtle text-success'
                        } px-2.5 py-1.5 rounded-3 fw-semibold`} style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>
                          {user.role}
                        </span>
                      )}
                    </td>

                    {/* تاريخ الانضمام */}
                    <td className="py-3 text-secondary">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </td>
                    
                    {/* أزرار التحكم */}
                    <td className="py-3 text-end">
                      <button 
                        className="btn btn-link text-primary p-1 me-2" 
                        title="Edit Role"
                        onClick={() => {
                          setEditingUserId(user.id);
                          setSelectedRole(user.role?.toLowerCase() || 'student');
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="btn btn-link text-danger p-1" 
                        title="Delete User"
                        onClick={() => openDeleteModal(user)} // 👈 بينادي المودال الجديد بدل الأليرت
                      >
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

      {/* 🗑️ مودال تأكيد الحذف المودرن (HTML/CSS Modal) */}
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
                <p>Are you sure you want to permanently delete this user account?</p>
                <strong className="text-danger">{userToDelete?.full_name}</strong>
                <p className="text-muted small mt-1">{userToDelete?.email}</p>
              </div>
              <div className={styles.modalFooterDelete}>
                <button type="button" className={styles.cancelBtn} onClick={closeDeleteModal}>Cancel</button>
                <button type="button" className={styles.confirmDeleteBtn} onClick={confirmDeleteUser}>Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}