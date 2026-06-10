import axios from "axios";

const BASE_URL =
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

/* ───────────────── JOBS ───────────────── */

export async function apiGetAllJobs() {
  const res = await axios.get(`${BASE_URL}/api/jobs`);
  return res.data;
}

export async function apiGetJobById(id) {
  const res = await axios.get(`${BASE_URL}/api/jobs/${id}`);
  return res.data;
}

/* ✅ FIXED APPLY JOB */
export async function apiApplyToJob(jobId) {
  const token = getToken();

  return axios.post(
    `${BASE_URL}/api/jobs/apply`,
    { job_id: jobId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function apiGetMyApplications() {
  const res = await axios.get(
    `${BASE_URL}/api/jobs/my-applications`,
    { headers: authHeaders() }
  );

  return res.data;
}

/* ───────────────── JOB MANAGEMENT ───────────────── */

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
export async function apiGetMyProjects() {
  const res = await axios.get(
    `${BASE_URL}/api/projects/my-projects`,
    { headers: authHeaders() }
  );
  return res.data;
}