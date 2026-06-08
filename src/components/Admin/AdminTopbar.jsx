import React from 'react';
import { Search, Bell, ShieldCheck } from 'lucide-react';
import styles from './AdminTopbar.module.css';

export default function AdminTopbar() {
  return (
    <header className={`${styles.topbar} d-flex align-items-center justify-content-between px-4`}>
      <div className={styles.searchWrapper}>
        <Search className={styles.searchIcon} size={18} />
        <input type="text" placeholder="Search..." className={styles.searchInput}/>
      </div>

      <div className="d-flex align-items-center gap-4">
        <button className={styles.notificationBtn}>
          <Bell size={20} />
          <span className={styles.notificationDot}></span>
        </button>

        <div className="d-flex align-items-center gap-3 border-start ps-4">
          <div className="text-end">
            <h4 className="m-0 fs-6 fw-bold text-dark">System Admin</h4>
            <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Administrator</span>
          </div>
          <div className={styles.profileBadge}>
            <ShieldCheck size={22} />
          </div>
        </div>
      </div>
    </header>
  );
}