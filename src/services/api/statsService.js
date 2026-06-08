import axios from 'axios';

const BASE_URL = 'https://final-project-backend-production-5fe7.up.railway.app/api';

export const getPlatformStats = async () => {
  const response = await axios.get(`${BASE_URL}/stats`);
  return response.data;
};
