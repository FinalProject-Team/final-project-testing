import axios from 'axios';
import { BASE_URL } from '../../../services/api/api';

const API_BASE_URL = BASE_URL;

export const getDashboardStats = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
    `${API_BASE_URL}/api/instructor/dashboard`,
    {
        headers: {Authorization: `Bearer ${token}`}
    }
);
return response.data;
};