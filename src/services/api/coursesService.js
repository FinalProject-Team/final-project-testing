import axios from 'axios';

const BASE_URL = 'https://final-project-backend-production-5fe7.up.railway.app/api';

export const getAllCourses = async () => {
  const response = await axios.get(`${BASE_URL}/courses`);
  return response.data;
};

export const getCourseById = async (id) => {
  const response = await axios.get(`${BASE_URL}/courses/${id}`);
  return response.data;
};
