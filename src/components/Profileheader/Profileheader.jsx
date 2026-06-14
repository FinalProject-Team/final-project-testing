import React, { useRef } from "react";
import styles from "./Profileheader.module.css";
import { FiEdit, FiMapPin, FiCamera, FiGlobe } from "react-icons/fi";
import { FaRegStar, FaBriefcase } from "react-icons/fa";
import { useProfile } from "../../context/ProfileContext";

function ProfileHeader() {
  const { profile, loading, uploadAvatar } = useProfile();
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadAvatar(file);
    // reset so same file can be re-selected
    e.target.value = '';
  };

  if (loading && !profile) {
    return (
      <div className={styles.headerCard}>
        <div className="d-flex align-items-center gap-4 w-100 p-2">
          <div style={{ width: 130, height: 130, borderRadius: 24, background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s infinite' }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: 28, width: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, marginBottom: 10 }} />
            <div style={{ height: 16, width: '160px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, marginBottom: 10 }} />
            <div style={{ height: 14, width: '120px', background: 'rgba(255,255,255,0.05)', borderRadius: 8 }} />
          </div>
        </div>
      </div>
    );
  }

  const displayName = profile?.full_name ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
    'Your Name';

  return (
    <div className={styles.headerCard}>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-4 w-100">

        <div className="d-flex align-items-center flex-wrap gap-4">
          <div className={styles.avatarWrapper}>
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={displayName} className={styles.avatar} />
            ) : (
              <div className={styles.avatar} style={{
                background: 'linear-gradient(135deg, #0EA5E9, #8B5CF6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 42, fontWeight: 700, color: '#fff'
              }}>
                {displayName[0]?.toUpperCase() || '?'}
              </div>
            )}
            <div className={styles.cameraBtn} onClick={handleAvatarClick} title="Change avatar">
              <FiCamera />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>

          <div className={styles.infoWrapper}>
            <h2 className={styles.name}>{displayName}</h2>
            <p className={styles.role}>{profile?.career_title || profile?.role || 'CareerTech Member'}</p>

            {profile?.location && (
              <p className={styles.location}>
                <FiMapPin /> {profile.location}
              </p>
            )}

            <div className={styles.statsRow}>
              <span className={styles.statItem}>
                <FaRegStar className={styles.starIcon} />
                {profile?.xp ? `${profile.xp.toLocaleString()} XP` : '0 XP'}
              </span>
              <span className={styles.statItem}>
                <FaBriefcase className={styles.briefcaseIcon} />
                {profile?.total_applications != null ? `${profile.total_applications} Applications` : '0 Applications'}
              </span>
              <span className={styles.statItem}>
                <FiGlobe className={styles.globeIcon} />
                {profile?.total_courses != null ? `${profile.total_courses} Courses` : '0 Courses'}
              </span>
            </div>
          </div>
        </div>

        <button className={styles.editBtn}>
          <FiEdit /> Edit Profile
        </button>

      </div>
    </div>
  );
}

export default ProfileHeader;
