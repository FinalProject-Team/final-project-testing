import axios from 'axios';

const BASE_URL = 'https://final-project-backend-production-214a.up.railway.app/api';

export const projectsService = {
getAll: async () => {
  const response = await axios.get(`${BASE_URL}/projects`);

  // 👇 أهم تعديل هنا
  return response.data.data || response.data.projects || response.data;
},
};