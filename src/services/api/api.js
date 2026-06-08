// import axios from 'axios';

// const BASE_URL =
//   import.meta.env.VITE_API_BASE_URL ||
//   'https://final-project-backend-production-214a.up.railway.app';

// function getToken() { return localStorage.getItem('token') || null; }
// function authHeaders() {
//   const token = getToken();
//   return token ? { Authorization: `Bearer ${token}` } : {};
// }

// // ─── AUTH ─────────────────────────────────────────────────────────────────────

// export async function apiLogin(email, password) {

//   const res = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
//   if (res.data?.token) localStorage.setItem('token', res.data.token);


//   console.log('LOGIN RESPONSE:', res.data);

  


//   return res.data;
// }

// export async function apiGoogleLogin(user) {
//   const res = await axios.post(
//     `${BASE_URL}/api/auth/google-login`,
//     { user },
//     { headers: authHeaders() }
//   );
//   if (res.data?.token) localStorage.setItem('token', res.data.token);
//   return res.data;
// }

// export async function apiGetMe() {
//   console.log('TOKEN BEFORE /ME:',
//     localStorage.getItem('token')
//   );

//   const res = await axios.get(
//     `${BASE_URL}/api/auth/me`,
//     {
//       headers: authHeaders()
//     }
//   );

//   return res.data;
// }

// export async function apiUpdateProfile(payload) {
//   const res = await axios.put(`${BASE_URL}/api/auth/profile`, payload, { headers: authHeaders() });
//   return res.data;
// }



// export async function apiRegister(payload) {
//   const res = await axios.post(
//     `${BASE_URL}/api/auth/register`,
//     payload
//   );

//   console.log('REGISTER RESPONSE:', res.data);

//   if (res.data?.token) {
//     localStorage.setItem('token', res.data.token);
//   }

//   return res.data;
// }
// // ─── COURSES ──────────────────────────────────────────────────────────────────

// export async function apiGetAllCourses() {
//   const res = await axios.get(`${BASE_URL}/api/courses`);
//   return res.data;
// }

// export async function apiGetCourseById(id) {
//   const res = await axios.get(`${BASE_URL}/api/courses/${id}`);
//   return res.data;
// }

// export async function apiCreateCourse(payload) {
//   const res = await axios.post(`${BASE_URL}/api/courses`, payload, { headers: authHeaders() });
//   return res.data;
// }

// export async function apiUpdateCourse(id, payload) {
//   const res = await axios.put(`${BASE_URL}/api/courses/${id}`, payload, { headers: authHeaders() });
//   return res.data;
// }

// export async function apiDeleteCourse(id) {
//   const res = await axios.delete(`${BASE_URL}/api/courses/${id}`, { headers: authHeaders() });
//   return res.data;
// }

// export async function apiGetCourseLessons(courseId) {
//   const res = await axios.get(`${BASE_URL}/api/courses/${courseId}/lessons`, { headers: authHeaders() });
//   return res.data;
// }

// // ─── LESSONS ──────────────────────────────────────────────────────────────────

// export async function apiGetLessonsForCourse(courseId) {
//   const res = await axios.get(`${BASE_URL}/api/lessons/course/${courseId}`, { headers: authHeaders() });
//   return res.data;
// }

// export async function apiCreateLesson(payload) {
//   const res = await axios.post(`${BASE_URL}/api/lessons`, payload, { headers: authHeaders() });
//   return res.data;
// }

// export async function apiUpdateLesson(id, payload) {
//   const res = await axios.put(`${BASE_URL}/api/lessons/${id}`, payload, { headers: authHeaders() });
//   return res.data;
// }

// export async function apiDeleteLesson(id) {
//   const res = await axios.delete(`${BASE_URL}/api/lessons/${id}`, { headers: authHeaders() });
//   return res.data;
// }

// // ─── ENROLLMENTS ──────────────────────────────────────────────────────────────

// export async function apiEnrollInCourse(courseId) {
//   const res = await axios.post(
//     `${BASE_URL}/api/enrollments/${courseId}`,
//     {},
//     { headers: authHeaders() }
//   );
//   return res.data;
// }

// // ─── INSTRUCTOR ───────────────────────────────────────────────────────────────

// export async function apiGetInstructorDashboard() {
//   const res = await axios.get(`${BASE_URL}/api/instructor/dashboard`, { headers: authHeaders() });
//   return res.data;
// }

// export async function apiGetInstructorCourses() {
//   const res = await axios.get(`${BASE_URL}/api/instructor/courses`, { headers: authHeaders() });
//   return res.data;
// }

// export async function apiGetInstructorCoursesSummary() {
//   const res = await axios.get(`${BASE_URL}/api/instructor/courses/summary`, { headers: authHeaders() });
//   return res.data;
// }

// // ─── ADMIN ────────────────────────────────────────────────────────────────────

// export async function apiGetAdminDashboard() {
//   const res = await axios.get(`${BASE_URL}/api/admin/dashboard`, { headers: authHeaders() });
//   return res.data;
// }

// export async function apiGetAdminUsers() {
//   const res = await axios.get(`${BASE_URL}/api/admin/users`, { headers: authHeaders() });
//   return res.data;
// }

// export async function apiUpdateUserRole(userId, role) {
//   const res = await axios.put(`${BASE_URL}/api/admin/user/${userId}/role`, { role }, { headers: authHeaders() });
//   return res.data;
// }

// export async function apiDeleteUser(userId) {
//   const res = await axios.delete(`${BASE_URL}/api/admin/user/${userId}`, { headers: authHeaders() });
//   return res.data;
// }

// // ─── JOBS ─────────────────────────────────────────────────────────────────────

// export async function apiGetAllJobs() {
//   const res = await axios.get(`${BASE_URL}/api/jobs`);
//   return res.data;
// }

// export async function apiGetJobById(id) {
//   const res = await axios.get(`${BASE_URL}/api/jobs/${id}`);
//   return res.data;
// }

// export async function apiApplyToJob(id) {
//   const res = await axios.post(`${BASE_URL}/api/jobs/${id}/apply`, {}, { headers: authHeaders() });
//   return res.data;
// }

// export async function apiGetMyApplications() {
//   const res = await axios.get(`${BASE_URL}/api/jobs/my-applications`, { headers: authHeaders() });
//   return res.data;
// }

// // ─── LIVE SESSIONS ────────────────────────────────────────────────────────────

// export async function apiGetAllLiveSessions() {
//   const res = await axios.get(`${BASE_URL}/api/live-sessions`);
//   return res.data;
// }

// export async function apiGetMyLiveSessions() {
//   const res = await axios.get(`${BASE_URL}/api/live-sessions/my`, { headers: authHeaders() });
//   return res.data;
// }

// export async function apiCreateLiveSession(payload) {
//   const res = await axios.post(`${BASE_URL}/api/live-sessions`, payload, { headers: authHeaders() });
//   return res.data;
// }

// // ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

// export async function apiGetNotifications() {
//   const res = await axios.get(`${BASE_URL}/notifications`, { headers: authHeaders() });
//   return res.data;
// }

// export async function apiGetUnreadCount() {
//   const res = await axios.get(`${BASE_URL}/notifications/unread-count`, { headers: authHeaders() });
//   return res.data;
// }

// export async function apiMarkAllNotificationsRead() {
//   const res = await axios.put(`${BASE_URL}/notifications/read-all`, {}, { headers: authHeaders() });
//   return res.data;
// }

// // ─── PROGRESS / DASHBOARD ─────────────────────────────────────────────────────

// export async function apiGetDashboardStats() {
//   const res = await axios.get(`${BASE_URL}/api/progress/dashboard-stats`, { headers: authHeaders() });
//   return res.data;
// }

// export async function apiGetMyProgress() {
//   const res = await axios.get(`${BASE_URL}/api/progress/my-progress`, { headers: authHeaders() });
//   return res.data;
// }

// export async function apiGetRecentActivity() {
//   const res = await axios.get(`${BASE_URL}/api/progress/recent-activity`, { headers: authHeaders() });
//   return res.data;
// }

// export async function apiGetContinueLearning() {
//   const res = await axios.get(`${BASE_URL}/api/progress/continue-learning`, { headers: authHeaders() });
//   return res.data;
// }

// export async function apiCompleteLesson(lessonId) {
//   const res = await axios.post(`${BASE_URL}/api/progress/lessons/${lessonId}/complete`, {}, { headers: authHeaders() });
//   return res.data;
// }

// // ─── RANKING ──────────────────────────────────────────────────────────────────

// export async function apiGetRanking() {
//   const res = await axios.get(`${BASE_URL}/api/ranking`);
//   return res.data;
// }

// export async function apiGetMyRank() {
//   const res = await axios.get(`${BASE_URL}/api/ranking/me`, { headers: authHeaders() });
//   return res.data;
// }

// // ─── ROADMAP ──────────────────────────────────────────────────────────────────

// export async function apiGetRoadmap() {
//   const res = await axios.get(`${BASE_URL}/api/roadmap`, { headers: authHeaders() });
//   return res.data;
// }

// // ─── PROJECTS ─────────────────────────────────────────────────────────────────

// export async function apiGetMyProjects() {
//   const res = await axios.get(`${BASE_URL}/api/projects/my-projects`, { headers: authHeaders() });
//   return res.data;
// }


import axios from 'axios';

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://final-project-backend-production-214a.up.railway.app';

function getToken() {
  return localStorage.getItem('token') || null;
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* ───────────────── AUTH ───────────────── */

export async function apiLogin(email, password) {
  const res = await axios.post(
    `${BASE_URL}/api/auth/login`,
    { email, password }
  );

  const token =
    res.data?.token ||
    res.data?.data?.session?.access_token;

  if (token) localStorage.setItem('token', token);

  return res.data;
}

export async function apiGoogleLogin(user) {
  const res = await axios.post(
    `${BASE_URL}/api/auth/google-login`,
    { user },
    { headers: authHeaders() }
  );

  const token = res.data?.token;
  if (token) localStorage.setItem('token', token);

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

export async function apiRegister(payload) {
  const res = await axios.post(
    `${BASE_URL}/api/auth/register`,
    payload
  );

  const token =
    res.data?.token ||
    res.data?.data?.session?.access_token;

  if (token) localStorage.setItem('token', token);

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

/* ───────────────── PROGRESS / DASHBOARD ───────────────── */

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

export async function apiApplyToJob(id) {
  const res = await axios.post(
    `${BASE_URL}/api/jobs/${id}/apply`,
    {},
    { headers: authHeaders() }
  );
  return res.data;
}

export async function apiGetMyApplications() {
  const res = await axios.get(
    `${BASE_URL}/api/jobs/my-applications`,
    { headers: authHeaders() }
  );
  return res.data;
}

/* ───────────────── PROJECTS ───────────────── */

export async function apiGetMyProjects() {
  const res = await axios.get(
    `${BASE_URL}/api/projects/my-projects`,
    { headers: authHeaders() }
  );
  return res.data;
}