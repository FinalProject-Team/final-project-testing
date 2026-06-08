import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  return (
    <div className={styles.layoutWrapper}>
      <AdminSidebar />
      
      <div className={styles.mainContent}>
        <AdminTopbar />
                <main style={{ width: '100%', minHeight: 'calc(100vh - 80px)', background: '#f8fafc' }}>
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}