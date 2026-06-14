import axios from "axios";
import { BASE_URL } from './api';

const API_BASE_URL = BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getInstructorDashboard = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/api/instructor/dashboard`,
    getAuthHeaders()
  );

  return response.data;
};

export const getInstructorCourses = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/api/instructor/courses`,
    getAuthHeaders()
  );

  return response.data;
};

export const getInstructorCoursesSummary = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/api/instructor/courses/summary`,
    getAuthHeaders()
  );

  return response.data;
};

export const getLiveSessions = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/api/live-sessions`,
    getAuthHeaders()
  );

  return response.data;
};

export const getInstructorLiveSessions = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/api/live-sessions/instructor`,
    getAuthHeaders()
  );

  return response.data;
};

export const getInstructorActivity = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/api/instructor/activity`,
    getAuthHeaders()
  );

  return response.data;
};

export const createCourse = async (courseData) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/courses`,
    courseData,
    getAuthHeaders()
  );

  return response.data;
};

export const updateCourse = async (id, courseData) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/courses/${id}`,
    courseData,
    getAuthHeaders()
  );

  return response.data;
};

export const deleteCourse = async (id) => {
  const response = await axios.delete(
    `${API_BASE_URL}/api/courses/${id}`,
    getAuthHeaders()
  );

  return response.data;
};


// // ================= ACTIVITY =================
// export const getInstructorActivity = async () => {
//   const response = await axios.get(
//     `${API_BASE_URL}/api/instructor/activity`,
//     getAuthHeaders()
//   );

//   return response.data;
// };

// ================= LESSONS =================

// create lesson
export const createLesson = async (lessonData) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/lessons`,
    lessonData,
    getAuthHeaders()
  );

  return response.data;
};

// get lessons by course id
export const getCourseLessons = async (courseId) => {
  const response = await axios.get(
    `${API_BASE_URL}/api/lessons/course/${courseId}`,
    getAuthHeaders()
  );

  return response.data;
};

// update lesson
export const updateLesson = async (id, lessonData) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/lessons/${id}`,
    lessonData,
    getAuthHeaders()
  );

  return response.data;
};

// delete lesson
export const deleteLesson = async (id) => {
  const response = await axios.delete(
    `${API_BASE_URL}/api/lessons/${id}`,
    getAuthHeaders()
  );

  return response.data;
};

// ================= LIVE SESSIONS =================

export const createLiveSession = async (sessionData) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/live-sessions`,
    sessionData,
    getAuthHeaders()
  );

  return response.data;
};

export const deleteLiveSession = async (id) => {
  const response = await axios.delete(
    `${API_BASE_URL}/api/live-sessions/${id}`,
    getAuthHeaders()
  );

  return response.data;
};

export const updateLiveSession = async (id, sessionData) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/live-sessions/${id}`,
    sessionData,
    getAuthHeaders()
  );

  return response.data;
};



////////////////////////////////////////////////////////////////////
// import axios from "axios";

// const API_BASE_URL =
//  "https://final-project-backend-production-214a.up.railway.app";

// const getAuthHeaders = () => {
//  const token = localStorage.getItem("token");

//  return {
//  headers: {
//  Authorization: `Bearer ${token}`,
//  },
//  };
// };

// export const getInstructorDashboard = async () => {
//  const response = await axios.get(
//  `${API_BASE_URL}/api/instructor/dashboard`,
//  getAuthHeaders()
//  );
//  return response.data;
// };

// export const getInstructorCourses = async () => {
//  const response = await axios.get(
//  `${API_BASE_URL}/api/instructor/courses`,
//  getAuthHeaders()
//  );
//  return response.data;
// };

// export const getInstructorCoursesSummary = async () => {
//  const response = await axios.get(
//  `${API_BASE_URL}/api/instructor/courses/summary`,
//  getAuthHeaders()
//  );
//  return response.data;
// };

// export const getLiveSessions = async () => {
//  const response = await axios.get(
//  `${API_BASE_URL}/api/live-sessions`,
//  getAuthHeaders()
//  );
//  return response.data;
// };

export const getCurrentUser = async () => {
 const response = await axios.get(
 `${API_BASE_URL}/api/auth/me`,
 getAuthHeaders()
 );
 return response.data;
};

export const getInstructorProfile = async () => {
 const response = await axios.get(
 `${API_BASE_URL}/api/instructor/profile/me`,
 getAuthHeaders()
 );
 return response.data;
};

export const updateAuthProfile = async (profileData) => {
 const response = await axios.put(
 `${API_BASE_URL}/api/auth/profile`,
 profileData,
 getAuthHeaders()
 );
 return response.data;
};

export const updateInstructorProfile = async (profileData) => {
 const response = await axios.put(
 `${API_BASE_URL}/api/instructor/profile/me`,
 profileData,
 getAuthHeaders()
 );
 return response.data;
};