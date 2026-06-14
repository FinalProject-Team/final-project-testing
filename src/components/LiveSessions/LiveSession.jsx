import React, { useState, useEffect } from 'react';
import styles from './LiveSession.module.css';
import JitsiMeeting from './JitsiMeeting';
import { apiGetMyLiveSessions, apiGetAllLiveSessions, apiGetMe } from '../../services/api/api';

function getRoomName(session) {
  return session.jitsi_room_id || `session-${session.id}`;
}

function computeStatus(session) {
  if (session.status) return session.status.toLowerCase();
  const now = new Date();
  const start = new Date(session.scheduled_at);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  if (now >= start && now <= end) return 'live';
  if (now > end) return 'completed';
  return 'upcoming';
}

function formatSessionDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    + ' • '
    + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function LiveSession() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sessionsData, setSessionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Jitsi state
  const [activeRoom, setActiveRoom] = useState(null); // { roomName, sessionTitle }
  const [studentName, setStudentName] = useState('Student');

  const tabs = ['All', 'Live Now', 'Upcoming', 'Completed', 'Workshops', 'Mentoring'];

  useEffect(() => {
    // Fetch sessions
    async function fetchSessions() {
      try {
        setIsLoading(true);
        // Try enrolled-student sessions first, fall back to all
        let data = [];
        try {
          data = await apiGetMyLiveSessions();
        } catch {
          data = await apiGetAllLiveSessions();
        }
        setSessionsData(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    // Fetch student name for Jitsi display
    async function fetchStudentName() {
      try {
        const me = await apiGetMe();
        const name = me?.user?.full_name || me?.full_name || 'Student';
        setStudentName(name);
      } catch { /* use default */ }
    }

    fetchSessions();
    fetchStudentName();
  }, []);

  const filteredSessions = sessionsData.filter(function (session) {
    const status = computeStatus(session);
    const matchesSearch =
      session.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === 'All') return true;
    if (activeTab === 'Live Now') return status === 'live' || status === 'live now';
    if (activeTab === 'Upcoming') return status === 'upcoming';
    if (activeTab === 'Completed') return status === 'completed';
    if (activeTab === 'Workshops') return session.session_type?.toLowerCase() === 'workshop';
    if (activeTab === 'Mentoring') return session.session_type?.toLowerCase() === 'mentoring';
    return true;
  });

  function getButtonDetails(session) {
    const status = computeStatus(session);
    if (status === 'live' || status === 'live now') return { text: 'Join Session', statusClass: 'live', disabled: false };
    if (status === 'completed') return { text: 'Session Ended', statusClass: 'ended', disabled: true };
    return { text: 'Not Started Yet', statusClass: 'upcoming', disabled: true };
  }

  const handleJoin = (session) => {
    const status = computeStatus(session);
    if (status !== 'live' && status !== 'live now') return;
    setActiveRoom({ roomName: getRoomName(session), sessionTitle: session.title });
  };

  return (
    <>
      {/* Embedded Jitsi overlay — full screen when active */}
      {activeRoom && (
        <JitsiMeeting
          roomName={activeRoom.roomName}
          userName={studentName}
          isMod={false}
          onClose={() => setActiveRoom(null)}
        />
      )}

      <div className={`container-fluid ${styles.sessionsWrapper}`}>
        <div className="container" style={{ maxWidth: '1140px' }}>

          <div className="row mb-4">
            <div className={`col-12 ${styles.headerSection}`}>
              <h2>Interactive Sessions</h2>
              <p>Join your live workshops, mentoring sessions, and real-time learning experiences — all inside CareerTech.</p>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-12">
              <div className={styles.searchWrapper}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  placeholder="Search sessions by title or description..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-12 d-flex flex-wrap gap-2">
              {tabs.map(tab => (
                <button
                  key={tab}
                  className={activeTab === tab ? styles.tabItemActive : styles.tabItem}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="col-12 text-center py-5">
              <div className="spinner-border text-light" role="status"></div>
              <p className="mt-2" style={{ color: '#ffffff' }}>Loading live sessions...</p>
            </div>
          ) : error ? (
            <div className="col-12 text-center py-5">
              <h4 style={{ color: '#ff4d4d' }}>Error loading sessions</h4>
              <p style={{ color: '#525f77' }}>{error}</p>
            </div>
          ) : (
            <div className="row g-4">
              {filteredSessions.length > 0 ? (
                filteredSessions.map(session => {
                  const btnDetails = getButtonDetails(session);
                  const status = computeStatus(session);
                  const isLive = status === 'live' || status === 'live now';

                  return (
                    <div key={session.id} className="col-12 col-md-6 col-lg-4 d-flex align-items-stretch">
                      <div className={`${styles.sessionCard} ${isLive ? styles.liveCardBorder : ''} w-100`}>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className={`${styles.typeBadge} ${styles[session.session_type?.toLowerCase()] || styles.defaultType}`}>
                            {session.session_type}
                          </span>
                          {isLive && (
                            <span className={styles.liveStatusBadge}>
                              <span className={styles.pulseDot}></span> Live Now
                            </span>
                          )}
                          {status === 'completed' && (
                            <span className={styles.completedStatusBadge}>Completed</span>
                          )}
                          {status === 'upcoming' && (
                            <span className={styles.upcomingStatusBadge}>Upcoming</span>
                          )}
                        </div>

                        <h3 className={styles.cardTitle}>{session.title}</h3>
                        <p className={styles.cardSubtitle}>{session.session_type} Class</p>

                        <div className="d-flex align-items-center gap-2 mb-3">
                          <span className={styles.userIcon}>👤</span>
                          <span className={styles.instructorName}>
                            {session.instructor_name || 'Instructor'}
                          </span>
                        </div>

                        <p className={styles.cardDesc}>{session.description}</p>

                        <div className={`mt-auto pt-3 ${styles.metaInfo}`}>
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <span>📅</span>
                            <p className="m-0 font-sm">{formatSessionDate(session.scheduled_at)}</p>
                          </div>
                          <div className="d-flex align-items-center gap-2 mb-3">
                            <span>📍</span>
                            <p className="m-0 font-sm" style={{ color: '#22d3ee', fontSize: '0.78rem' }}>
                              {isLive ? 'Embedded — no external app needed' : 'CareerTech Live Room'}
                            </p>
                          </div>
                        </div>

                        <button
                          className={`${styles.actionBtn} ${styles[btnDetails.statusClass]}`}
                          onClick={() => handleJoin(session)}
                          disabled={btnDetails.disabled}
                        >
                          {isLive && <span>📹 </span>}
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
                  <p style={{ color: '#525f77', fontSize: '14px' }}>No sessions match your current filter.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
