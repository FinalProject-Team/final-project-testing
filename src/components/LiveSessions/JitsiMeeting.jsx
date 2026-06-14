import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './JitsiMeeting.module.css';
import { PhoneOff, X } from 'lucide-react';

/**
 * JitsiMeeting — embeds a Jitsi Meet room inside CareerTech.
 *
 * Props:
 *  roomName  — unique room ID (e.g. "session-abc123")
 *  userName  — display name shown inside the room
 *  isMod     — true for instructor (mic+cam on by default, host controls)
 *  onClose   — called when user leaves or closes
 */
export default function JitsiMeeting({ roomName, userName, isMod = false, onClose }) {
  const containerRef = useRef(null);
  const apiRef       = useRef(null);

  const [phase, setPhase] = useState('loading-sdk'); // 'loading-sdk' | 'ready' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  // ── Step 1: Load Jitsi SDK script ─────────────────────────────────────
  useEffect(() => {
    // Already loaded from a previous mount — go straight to ready
    if (window.JitsiMeetExternalAPI) {
      setPhase('ready');
      return;
    }

    // Avoid adding duplicate script tags
    const existing = document.getElementById('jitsi-sdk');
    if (existing) {
      // Script tag exists but hasn't fired onload yet — wait for it
      const onload = () => setPhase('ready');
      existing.addEventListener('load', onload);
      return () => existing.removeEventListener('load', onload);
    }

    const script = document.createElement('script');
    script.id    = 'jitsi-sdk';
    script.src   = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload  = () => setPhase('ready');
    script.onerror = () => {
      setErrorMsg('Could not load the Jitsi SDK. Check your internet connection and that meet.jit.si is reachable.');
      setPhase('error');
    };
    document.head.appendChild(script);
  }, []);

  // ── Step 2: Init Jitsi after SDK loads AND container is in DOM ─────────
  const initJitsi = useCallback(() => {
    if (!containerRef.current) return;
    if (apiRef.current) return; // already initialised
    if (!window.JitsiMeetExternalAPI) {
      setErrorMsg('JitsiMeetExternalAPI is not available.');
      setPhase('error');
      return;
    }

    // Sanitise room name: lowercase, no spaces, only alphanumeric + hyphens
    const safeRoom = `careertech-${roomName}`
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-{2,}/g, '-')
      .slice(0, 64);

    try {
      apiRef.current = new window.JitsiMeetExternalAPI('meet.jit.si', {
        roomName:   safeRoom,
        parentNode: containerRef.current,
        width:      '100%',
        height:     '100%',
        userInfo: {
          displayName: userName || (isMod ? 'Instructor' : 'Student'),
        },
        configOverwrite: {
          // Audio / video defaults
          startWithAudioMuted: !isMod,
          startWithVideoMuted: !isMod,

          // Skip pre-join screen — go straight into the room
          prejoinPageEnabled:      false,
          disableDeepLinking:      true,
          enableWelcomePage:       false,
          enableClosePage:         false,

          // Disable features that require a dedicated Jitsi server
          enableEmailInStats:      false,
          disableThirdPartyRequests: true,

          // Toolbar — use configOverwrite (not interfaceConfigOverwrite which is deprecated)
          toolbarButtons: [
            'microphone', 'camera', 'chat', 'desktop',
            'participants-pane', 'hangup', 'tileview',
            'raisehand', 'settings',
          ],

          // Room subject shown at top
          subject: userName ? `${userName}'s Session` : 'CareerTech Live Session',
        },
        // interfaceConfigOverwrite is deprecated in newer Jitsi — intentionally omitted
      });

      // Listen for hangup so we can close the overlay
      apiRef.current.addEventListener('readyToClose', () => {
        if (onClose) onClose();
      });

      apiRef.current.addEventListener('videoConferenceLeft', () => {
        if (onClose) onClose();
      });

    } catch (e) {
      setErrorMsg('Could not start the meeting: ' + e.message);
      setPhase('error');
    }
  }, [roomName, userName, isMod, onClose]);

  // Fire initJitsi once phase becomes 'ready'
  useEffect(() => {
    if (phase !== 'ready') return;
    // Small timeout lets React flush the container div into the DOM
    const tid = setTimeout(initJitsi, 50);
    return () => clearTimeout(tid);
  }, [phase, initJitsi]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (apiRef.current) {
        try { apiRef.current.dispose(); } catch (_) {}
        apiRef.current = null;
      }
    };
  }, []);

  // ── Error state ─────────────────────────────────────────────────────────
  if (phase === 'error') {
    return (
      <div className={styles.overlay}>
        <div className={styles.errorBox}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
          <h3 style={{ color: '#f87171', marginBottom: 8 }}>Meeting could not start</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: 24, maxWidth: 380, textAlign: 'center' }}>
            {errorMsg}
          </p>
          <button className={styles.closeTopBtn} onClick={onClose}>
            <X size={16} /> Close
          </button>
        </div>
      </div>
    );
  }

  // ── Main render ─────────────────────────────────────────────────────────
  return (
    <div className={styles.overlay}>
      <div className={styles.meetingWrapper}>

        {/* Top bar */}
        <div className={styles.meetingBar}>
          <div className={styles.meetingTitle}>
            <span className={styles.liveDot} />
            <span>{isMod ? '🎙 You are hosting' : '📺 Live Session'}</span>
            {roomName && (
              <span style={{ color: '#475569', fontSize: '0.75rem', marginLeft: 8 }}>
                Room: careertech-{roomName.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 20)}
              </span>
            )}
          </div>
          <button className={styles.closeTopBtn} onClick={onClose} title="Leave meeting">
            <PhoneOff size={16} /> Leave
          </button>
        </div>

        {/* Loading overlay — shown on top of containerRef, removed once Jitsi inits */}
        {phase === 'loading-sdk' && (
          <div className={styles.loadingRoom}>
            <div className="spinner-border" style={{ color: '#22d3ee', width: 40, height: 40 }} role="status" />
            <p>Loading meeting SDK…</p>
            <p style={{ fontSize: '0.75rem', color: '#475569' }}>Connecting to meet.jit.si</p>
          </div>
        )}

        {/*
          Container is ALWAYS rendered so containerRef.current is never null.
          Jitsi injects its iframe directly into this div.
          The loading overlay above sits on top of it via CSS until SDK is ready.
        */}
        <div
          ref={containerRef}
          className={styles.jitsiContainer}
          style={{ visibility: phase === 'ready' ? 'visible' : 'hidden' }}
        />

      </div>
    </div>
  );
}
