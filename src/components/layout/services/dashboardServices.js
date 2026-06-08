import axios from 'axios';

export const getDashboardStats = async () => {
    const token = localStorage.getItem("token"); 

    const response = await axios.get(
    'https://final-project-backend-production-214a.up.railway.app/api/dashboard/stats',
    {
        headers: {Authorization: `Bearer ${token}`}
    }
);
return response.data;
};