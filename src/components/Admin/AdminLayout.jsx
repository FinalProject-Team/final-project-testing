import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  // 🔍 1. عرفنا الـ State اللي هتشيل النص اللي بيتكتب في البحث
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  // 🧼 2. تصفية خانة البحث تلقائياً لما الطالب أو الأدمن يتنقل بين الصفحات
  useEffect(() => {
    setSearchQuery('');
  }, [location.pathname]);

  return (
    <div className={styles.layoutWrapper}>
      <AdminSidebar />
      
      <div className={styles.mainContent}>
        {/* 🔄 3. مررنا الـ State والـ Setter للـ Topbar كـ Props */}
        <AdminTopbar searchValue={searchQuery} setSearchValue={setSearchQuery} />
        
        <main style={{ width: '100%', minHeight: 'calc(100vh - 80px)', background: '#f8fafc' }}>
          {/* 📥 4. مررنا قيمة البحث الحالية عبر الـ context لكل الصفحات اللي بتفتح جوه الـ Outlet */}
          <Outlet context={{ searchQuery }} /> 
        </main>
      </div>
    </div>
  );
}