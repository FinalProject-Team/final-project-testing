import React, { useState, useEffect } from 'react';
import styles from './LiveSession.module.css';

export default function LiveSession() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sessionsData, setSessionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = ['All', 'Live Now', 'Upcoming', 'Completed', 'Workshops', 'Mentoring'];

  // 1️⃣ جلب البيانات من الـ API عند تحميل الصفحة
  useEffect(function () {
    async function fetchSessions() {
      try {
        setIsLoading(true);
        const response = await fetch('https://final-project-backend-production-214a.up.railway.app/api/live-sessions');
        
        if (!response.ok) {
          throw new Error('Failed to fetch live sessions');
        }
        
        const result = await response.json();
        // الـ API بيرجع كائن جواه داتا { data: [...] } كما في صورة image_e49724.png
        setSessionsData(result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSessions();
  }, []);

  // 2️⃣ الفلترة بناءً على الـ Tab النشط والبحث
  const filteredSessions = sessionsData.filter(function (session) {
    // فلترة البحث (العنوان أو الوصف)
    const matchesSearch = 
      session.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      session.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // فلترة الـ Tabs بناءً على حالة ونوع السيشن من الـ API
    if (activeTab === 'All') return true;
    if (activeTab === 'Live Now') return session.status?.toLowerCase() === 'live now' || session.status?.toLowerCase() === 'live';
    if (activeTab === 'Upcoming') return session.status?.toLowerCase() === 'upcoming';
    if (activeTab === 'Completed') return session.status?.toLowerCase() === 'completed';
    
    // فلترة الأنواع (Workshops و Mentoring)
    if (activeTab === 'Workshops') return session.session_type?.toLowerCase() === 'workshop';
    if (activeTab === 'Mentoring') return session.session_type?.toLowerCase() === 'mentoring';

    return true;
  });

  // دالة مساعدة لتنسيق الوقت والتاريخ بشكل لطيف
  function formatSessionDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ' • ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // دالة مساعدة لتحديد شكل وزرار الانضمام بناءً على الحالة
  function getButtonDetails(status) {
    const currentStatus = status?.toLowerCase();
    if (currentStatus === 'live now' || currentStatus === 'live') {
      return { text: 'Join Session', statusClass: 'live' };
    } else if (currentStatus === 'completed') {
      return { text: 'Session Ended', statusClass: 'ended' };
    } else {
      return { text: 'Not Started Yet', statusClass: 'upcoming' };
    }
  }

  return (
    <div className={`container-fluid ${styles.sessionsWrapper}`}>
      <div className="container" style={{ maxWidth: '1140px' }}>
        
        {/* الهيدر */}
        <div className="row mb-4">
          <div className={`col-12 ${styles.headerSection}`}>
            <h2>Interactive Sessions</h2>
            <p>Join your live workshops, mentoring sessions, and real-time learning experiences.</p>
          </div>
        </div>

        {/* حقل البحث */}
        <div className="row mb-4">
          <div className="col-12">
            <div className={styles.searchWrapper}>
              <span className={styles.searchIcon}>🔍</span>
              <input 
                type="text" 
                placeholder="Search sessions by title or description..." 
                className={styles.searchInput} 
                value={searchQuery}
                onChange={function(e) { setSearchQuery(e.target.value); }}
              />
            </div>
          </div>
        </div>

        {/* التابات */}
        <div className="row mb-4">
          <div className="col-12 d-flex flex-wrap gap-2">
            {tabs.map(function(tab) {
              return (
                <button
                  key={tab}
                  className={activeTab === tab ? styles.tabItemActive : styles.tabItem}
                  onClick={function() { setActiveTab(tab); }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* عرض حالة التحميل أو الخطأ أو الكروت */}
        {isLoading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-light" role="status"></div>
            <p className="mt-2" style={{ color: '#ffffff' }}>Loading live sessions...</p>
          </div>
        ) : error ? (
          <div className="col-12 text-center py-5">
            <h4 style={{ color: '#ff4d4d' }}>Error loading data</h4>
            <p style={{ color: '#525f77' }}>{error}</p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredSessions.length > 0 ? (
              filteredSessions.map(function(session) {
                const btnDetails = getButtonDetails(session.status);
                
                return (
                  <div key={session.id} className="col-12 col-md-6 col-lg-4 d-flex align-items-stretch">
                    <div className={`${styles.sessionCard} ${session.status === 'live now' ? styles.liveCardBorder : ''} w-100`}>
                      
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className={`${styles.typeBadge} ${styles[session.session_type?.toLowerCase()] || styles.defaultType}`}>
                          {session.session_type}
                        </span>
                        
                        {(session.status === 'live now' || session.status === 'live') && (
                          <span className={styles.liveStatusBadge}>
                            <span className={styles.pulseDot}></span> Live Now
                          </span>
                        )}
                        {session.status === 'completed' && (
                          <span className={styles.completedStatusBadge}>Completed</span>
                        )}
                        {session.status === 'upcoming' && (
                          <span className={styles.upcomingStatusBadge}>Upcoming</span>
                        )}
                      </div>

                      <h3 className={styles.cardTitle}>{session.title}</h3>
                      {/* لو مفيش subtitle من الـ API هنعرض الـ session_type بشكل شيك */}
                      <p className={styles.cardSubtitle}>{session.session_type} Class</p>
                      
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className={styles.userIcon}>👤</span>
                        {/* الـ API بيرجع الـ instructor_id، هنكتب مكانه Instructor بشكل مؤقت أو نعرضه */}
                        <span className={styles.instructorName}>Instructor ID: {session.instructor_id?.substring(0, 8)}...</span>
                      </div>

                      <p className={styles.cardDesc}>{session.description}</p>

                      <div className={`mt-auto pt-3 ${styles.metaInfo}`}>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span>📅</span> <p className="m-0 font-sm">{formatSessionDate(session.scheduled_at)}</p>
                        </div>
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <span>⏳</span> <p className="m-0 font-sm">60 minutes</p>
                        </div>
                      </div>

                      {/* زرار الأكشن للانضمام للينك زوم المباشر من الـ API */}
                      <button 
                        className={`${styles.actionBtn} ${styles[btnDetails.statusClass]}`}
                        onClick={function() {
                          if (session.meeting_link) {
                            window.open(session.meeting_link, '_blank');
                          }
                        }}
                        disabled={session.status === 'completed'}
                      >
                        {(session.status === 'live now' || session.status === 'live') && <span>📹 </span>}
                        {btnDetails.text}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-12 text-center py-5">
                <div className="mb-3" style={{ fontSize: '40px' }}>🔍❌</div>
                <h4 style={{ color: '#ffffff', fontWeight: '600' }}>No Sessions Found</h4>
                <p style={{ color: '#525f77', fontSize: '14px' }}>We couldn't find any session matching your selection.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}