import axios from "axios";

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://final-project-backend-production-214a.up.railway.app";

/* ───────────────── TOKEN ───────────────── */

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  const token = getToken();

  return token
    ? {
      Authorization: `Bearer ${token}`,
    }
    : {};
}

/* ───────────────── AUTH ───────────────── */

export async function apiLogin(email, password) {
  const res = await axios.post(
    `${BASE_URL}/api/auth/login`,
    { email, password }
  );

  const token = res.data?.token;

  if (!token) {
    throw new Error("No token returned from server");
  }

  // امسح أي توكن قديم قبل التخزين
  localStorage.removeItem("token");

  // خزّن التوكن الجديد
  localStorage.setItem("token", token);

  return res.data;
}

export async function apiRegister(payload) {
  const res = await axios.post(
    `${BASE_URL}/api/auth/register`,
    payload
  );

  const token = res.data?.token;

  if (token) {
    localStorage.setItem("token", token);
  }

  return res.data;
}

export async function apiGoogleLogin(user) {
  const res = await axios.post(
    `${BASE_URL}/api/auth/google-login`,
    { user },
    { headers: authHeaders() }
  );

  const token = res.data?.token;

  if (token) {
    localStorage.setItem("token", token);
  }

  return res.data;
}

export async function apiGetMe() {
  const res = await axios.get(
    `${BASE_URL}/api/auth/me`,
    { headers: authHeaders() }
  );

  return res.data;
}

export async function apiUpdateProfile(payload) {
  const res = await axios.put(
    `${BASE_URL}/api/auth/profile`,
    payload,
    { headers: authHeaders() }
  );

  return res.data;
}

/* ───────────────── COURSES ───────────────── */

export async function apiGetAllCourses() {
  const res = await axios.get(`${BASE_URL}/api/courses`);
  return res.data;
}

export async function apiGetCourseById(id) {
  const res = await axios.get(`${BASE_URL}/api/courses/${id}`);
  return res.data;
}

export async function apiCreateCourse(payload) {
  const res = await axios.post(
    `${BASE_URL}/api/courses`,
    payload,
    { headers: authHeaders() }
  );

  return res.data;
}

export async function apiUpdateCourse(id, payload) {
  const res = await axios.put(
    `${BASE_URL}/api/courses/${id}`,
    payload,
    { headers: authHeaders() }
  );

  return res.data;
}

export async function apiDeleteCourse(id) {
  const res = await axios.delete(
    `${BASE_URL}/api/courses/${id}`,
    { headers: authHeaders() }
  );

  return res.data;
}

/* ───────────────── LESSONS ───────────────── */

export async function apiGetCourseLessons(courseId) {
  const res = await axios.get(
    `${BASE_URL}/api/courses/${courseId}/lessons`,
    { headers: authHeaders() }
  );

  return res.data;
}

export async function apiGetLessonsForCourse(courseId) {
  const res = await axios.get(
    `${BASE_URL}/api/lessons/course/${courseId}`,
    { headers: authHeaders() }
  );

  return res.data;
}

export async function apiCreateLesson(payload) {
  const res = await axios.post(
    `${BASE_URL}/api/lessons`,
    payload,
    { headers: authHeaders() }
  );

  return res.data;
}

export async function apiUpdateLesson(id, payload) {
  const res = await axios.put(
    `${BASE_URL}/api/lessons/${id}`,
    payload,
    { headers: authHeaders() }
  );

  return res.data;
}

export async function apiDeleteLesson(id) {
  const res = await axios.delete(
    `${BASE_URL}/api/lessons/${id}`,
    { headers: authHeaders() }
  );

  return res.data;
}

/* ───────────────── ENROLLMENT ───────────────── */

export async function apiEnrollInCourse(courseId) {
  const res = await axios.post(
    `${BASE_URL}/api/enrollments/${courseId}`,
    {},
    { headers: authHeaders() }
  );

  return res.data;
}

/* ───────────────── PROGRESS ───────────────── */

export async function apiGetRoadmap() {
  const res = await axios.get(
    `${BASE_URL}/api/roadmap`,
    { headers: authHeaders() }
  );

  return res.data;
}

export async function apiGetDashboardStats() {
  const res = await axios.get(
    `${BASE_URL}/api/progress/dashboard-stats`,
    { headers: authHeaders() }
  );

  return res.data;
}

export async function apiGetMyProgress() {
  const res = await axios.get(
    `${BASE_URL}/api/progress/my-progress`,
    { headers: authHeaders() }
  );

  return res.data;
}

export async function apiGetRecentActivity() {
  const res = await axios.get(
    `${BASE_URL}/api/progress/recent-activity`,
    { headers: authHeaders() }
  );

  return res.data;
}

export async function apiGetContinueLearning() {
  const res = await axios.get(
    `${BASE_URL}/api/progress/continue-learning`,
    { headers: authHeaders() }
  );

  return res.data;
}

export async function apiCompleteLesson(lessonId) {
  const res = await axios.post(
    `${BASE_URL}/api/progress/lessons/${lessonId}/complete`,
    {},
    { headers: authHeaders() }
  );

  return res.data;
}

// JOBS — api.js  (replace only the JOBS section in your file)
// BUG FIXED: apiGetMyApplications was returning res.data on a
// plain array response. axios wraps the response body in .data,
// so res already IS the array. Reading .data off an array gives
// undefined, which always resolved to [] in the component.
// ─────────────────────────────────────────────────────────────

export async function apiGetAllJobs() {
  const res = await axios.get(`${BASE_URL}/api/jobs`);
  return res.data;
}

export async function apiGetJobById(id) {
  const res = await axios.get(`${BASE_URL}/api/jobs/${id}`);
  return res.data;
}

export async function apiApplyToJob(jobId, coverLetter) {
  const res = await axios.post(
    `${BASE_URL}/api/jobs/apply`,
    { job_id: jobId, cover_letter: coverLetter },
    { headers: authHeaders() }
  );
  return res.data;
}

// FIX: return res.data directly (the array).
// Before: returned res.data which callers then read .data on → undefined.
export async function apiGetMyApplications() {
  const res = await axios.get(
    `${BASE_URL}/api/jobs/my/applications`,
    { headers: authHeaders() }
  );
  return res.data; // ← this IS the array. Callers must NOT do .data again.
}

export async function apiCreateJob(payload) {
  const res = await axios.post(
    `${BASE_URL}/api/jobs`,
    payload,
    { headers: authHeaders() }
  );
  return res.data;
}

export async function apiGetMyJobs() {
  const res = await axios.get(
    `${BASE_URL}/api/jobs/my/jobs`,
    { headers: authHeaders() }
  );
  return res.data;
}

export async function apiGetJobApplicants(jobId) {
  const res = await axios.get(
    `${BASE_URL}/api/jobs/${jobId}/applicants`,
    { headers: authHeaders() }
  );
  return res.data;
}

export async function apiUpdateApplicationStatus(applicationId, status) {
  const res = await axios.patch(
    `${BASE_URL}/api/jobs/applications/${applicationId}/status`,
    { status },
    { headers: authHeaders() }
  );
  return res.data;
}
export async function apiGetMyProjects(params = {}) {
  const res = await axios.get(
    `${BASE_URL}/api/projects/my-projects`,
    { params, headers: authHeaders() }
  );

  return res.data;
}
  /* ───────────────── LEADERBOARD & RANKINGS ───────────────── */

export async function apiGetLeaderboard() {
  const res = await axios.get(
    `${BASE_URL}/api/ranking`,
    { headers: authHeaders() }
  );
  return res.data;
}

export async function apiGetMyRank() {
  const res = await axios.get(
    `${BASE_URL}/api/ranking/me`,
    { headers: authHeaders() }
  );
  return res.data;
}

/* ───────────────── PROGRESS DASHBOARD ───────────────── */

export async function apiGetProgressDashboard() {
  const res = await axios.get(
    `${BASE_URL}/api/progress/progress-dashboard`,
    { headers: authHeaders() }
  );
  return res.data;
}

export async function apiAddLearningTime(hours) {
  const res = await axios.post(
    `${BASE_URL}/api/progress/learning-time`,
    { hours },
    { headers: authHeaders() }
  );
  return res.data;
}

export async function apiGetDashboardSummary() {
  const res = await axios.get(
    `${BASE_URL}/api/progress/dashboard-summary`,
    { headers: authHeaders() }
  );
  return res.data;
}

/* ───────────────── NOTIFICATIONS ───────────────── */

export async function apiGetNotifications() {
  const res = await axios.get(
    `${BASE_URL}/notifications`,
    { headers: authHeaders() }
  );
  const data = res.data;
  return Array.isArray(data) ? data : data.notifications || [];
}

export async function apiGetUnreadNotificationCount() {
  const res = await axios.get(
    `${BASE_URL}/notifications/unread-count`,
    { headers: authHeaders() }
  );
  return res.data?.unread ?? 0;
}

export async function apiMarkNotificationRead(id) {
  const res = await axios.put(
    `${BASE_URL}/notifications/${id}/read`,
    {},
    { headers: authHeaders() }
  );
  return res.data;
}

export async function apiMarkAllNotificationsRead() {
  const res = await axios.put(
    `${BASE_URL}/notifications/read-all`,
    {},
    { headers: authHeaders() }
  );
  return res.data;
}

/* ───────────────── LIVE SESSIONS ───────────────── */

export async function apiGetAllLiveSessions() {
  const res = await axios.get(`${BASE_URL}/api/live-sessions`);
  const data = res.data;
  return Array.isArray(data) ? data : data?.data || [];
}

export async function apiGetMyLiveSessions() {
  const res = await axios.get(
    `${BASE_URL}/api/live-sessions/my`,
    { headers: authHeaders() }
  );
  const data = res.data;
  return Array.isArray(data) ? data : data?.data || [];
}

export async function apiGetLiveSessionById(id) {
  const res = await axios.get(`${BASE_URL}/api/live-sessions/${id}`);
  return res.data;
}

export async function apiCreateLiveSession(payload) {
  const res = await axios.post(
    `${BASE_URL}/api/live-sessions`,
    payload,
    { headers: authHeaders() }
  );
  return res.data;
}


/* ───────────────── ADMIN ───────────────── */

export async function apiGetAdminDashboard() {
  const res = await axios.get(
    `${BASE_URL}/api/admin/dashboard`,
    { headers: authHeaders() }
  );
  return res.data;
}

export async function apiGetAdminUsers() {
  const res = await axios.get(
    `${BASE_URL}/api/admin/users`,
    { headers: authHeaders() }
  );
  return res.data;
}

export async function apiUpdateUserRole(id, role) {
  const res = await axios.put(
    `${BASE_URL}/api/admin/user/${id}/role`,
    { role },
    { headers: authHeaders() }
  );
  return res.data;
}

export async function apiDeleteUser(id) {
  const res = await axios.delete(
    `${BASE_URL}/api/admin/user/${id}`,
    { headers: authHeaders() }
  );
  return res.data;
}

/* ───────────────── LESSON (single) ───────────────── */

export async function apiGetLessonById(id) {
  const res = await axios.get(
    `${BASE_URL}/api/lessons/${id}`,
    { headers: authHeaders() }
  );
  return res.data;
}


/* ───────────────── PROJECTS ───────────────── */

export async function apiGetAllProjects(params = {}) {
  const res = await axios.get(`${BASE_URL}/api/projects`, { params });
  const data = res.data;
  return data?.data || data?.projects || data;
}

export async function apiGetProjectById(id) {
  const res = await axios.get(`${BASE_URL}/api/projects/${id}`);
  return res.data;
}

export async function apiCreateProject(payload) {
  const res = await axios.post(
    `${BASE_URL}/api/projects`,
    payload,
    { headers: authHeaders() }
  );
  return res.data;
}

export async function apiUpdateProject(id, payload) {
  const res = await axios.put(
    `${BASE_URL}/api/projects/${id}`,
    payload,
    { headers: authHeaders() }
  );
  return res.data;
}

export async function apiDeleteProject(id) {
  const res = await axios.delete(
    `${BASE_URL}/api/projects/${id}`,
    { headers: authHeaders() }
  );
  return res.data;
}

