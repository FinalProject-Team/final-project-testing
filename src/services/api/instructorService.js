import axios from "axios";

const API_BASE_URL =
  "https://final-project-backend-production-214a.up.railway.app";

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