import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { apiGetMe, apiUpdateProfile, BASE_URL } from '../services/api/api';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const { user, isAuthenticated } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  function getToken() {
    return localStorage.getItem('token') || null;
  }

  function authHeaders() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // ── Fetch profile from /api/auth/me ──────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetMe();
      // Backend may return { user } or { profile } or the object directly
      const raw = data?.user || data?.profile || data;
      setProfile({
        full_name:   raw?.full_name   || raw?.name       || '',
        first_name:  raw?.first_name  || (raw?.full_name || raw?.name || '').split(' ')[0] || '',
        last_name:   raw?.last_name   || (raw?.full_name || raw?.name || '').split(' ').slice(1).join(' ') || '',
        email:       raw?.email       || user?.email     || '',
        bio:         raw?.bio         || '',
        career_title: raw?.career_title || raw?.job_title || raw?.title || '',
        location:    raw?.location    || '',
        avatar_url:  raw?.avatar_url  || raw?.image      || '',
        website:     raw?.website     || '',
        twitter:     raw?.twitter     || '',
        linkedin:    raw?.linkedin    || '',
        github:      raw?.github      || '',
        skills:      raw?.skills      || [],
        role:        raw?.role        || '',
        xp:          raw?.xp          || 0,
        total_courses: raw?.total_courses || 0,
        total_applications: raw?.total_applications || 0,
        current_streak: raw?.current_streak || 0,
        certificates_count: raw?.certificates_count || 0,
      });
    } catch (err) {
      console.error('[ProfileContext] fetchProfile error:', err);
      setError('Failed to load profile. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated) fetchProfile();
  }, [isAuthenticated, fetchProfile]);

  // ── Update profile via /api/auth/profile ─────────────────────────────────
  const updateProfile = async (payload) => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);
    try {
      const updated = await apiUpdateProfile(payload);
      setProfile(prev => ({ ...prev, ...payload, ...(updated?.user || updated?.profile || updated) }));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      return true;
    } catch (err) {
      console.error('[ProfileContext] updateProfile error:', err);
      setError(err.response?.data?.message || 'Failed to save profile.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ── Upload avatar via Supabase Storage or backend upload endpoint ─────────
  const uploadAvatar = async (file) => {
    if (!file) return null;
    setSaving(true);
    setError(null);
    try {
      // Try backend multipart upload first
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await axios.post(`${BASE_URL}/api/auth/upload-avatar`, formData, {
        headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' },
      });
      const avatarUrl = res.data?.avatar_url || res.data?.url;
      if (avatarUrl) {
        setProfile(prev => ({ ...prev, avatar_url: avatarUrl }));
        return avatarUrl;
      }
      return null;
    } catch (err) {
      // Fallback: show local preview only, document that upload endpoint is missing
      console.warn('[ProfileContext] Avatar upload endpoint not available:', err.message);
      // Create a local object URL for immediate preview
      const localUrl = URL.createObjectURL(file);
      setProfile(prev => ({ ...prev, avatar_url: localUrl }));
      setError('Avatar preview shown locally. Backend upload endpoint (POST /api/auth/upload-avatar) is missing — avatar will not persist after refresh.');
      return localUrl;
    } finally {
      setSaving(false);
    }
  };

  const value = {
    profile,
    loading,
    saving,
    error,
    saveSuccess,
    fetchProfile,
    updateProfile,
    uploadAvatar,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside <ProfileProvider>');
  return ctx;
}
