// import axios from 'axios';
// import { BASE_URL } from '../../../services/api/api';

// const API_BASE_URL = BASE_URL;

// const DEFAULT_STATS = {
//   user: { full_name: 'Developer', level: 'Learning' },
//   scheduled: { lessons: 0, assessments: 0 },
//   xp: { total: 0, today: 0 },
//   courses: { done: 0, total: 0, percentage: 0 },
//   jobs: { matches: 0, newToday: 0 },
//   streak: { days: 0 }
// };

// // Get auth headers from localStorage token
// function getAuthHeaders() {
//   const token = localStorage.getItem("token");
//   return token 
//     ? { Authorization: `Bearer ${token}` }
//     : {};
// }

// export const getDashboardStats = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.warn('[getDashboardStats] No token found');
//         return DEFAULT_STATS;
//       }

//       const response = await axios.get(
//         `${API_BASE_URL}/api/progress/dashboard-stats`,
//         { 
//           headers: getAuthHeaders()
//         }
//       );
      
//       // Handle different response formats
//       const data = response.data;
//       console.log('[getDashboardStats] API Response:', data);
      
//       // If data is wrapped in a data property, unwrap it
//       const stats = data?.data || data;
      
//       // Ensure all required fields exist
//       return {
//         user: stats?.user || DEFAULT_STATS.user,
//         scheduled: stats?.scheduled || DEFAULT_STATS.scheduled,
//         xp: stats?.xp || DEFAULT_STATS.xp,
//         courses: stats?.courses || DEFAULT_STATS.courses,
//         jobs: stats?.jobs || DEFAULT_STATS.jobs,
//         streak: stats?.streak || DEFAULT_STATS.streak
//       };
//     } catch (error) {
//       console.error('[getDashboardStats] Error:', {
//         message: error?.message,
//         status: error?.response?.status,
//         data: error?.response?.data
//       });
//       return DEFAULT_STATS;
//     }
// };
