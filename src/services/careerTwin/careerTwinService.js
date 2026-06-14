/**
 * careerTwinService.js - Career Twin API integration
 * Re-exports functions from api.js for Career Twin feature
 */

export {
  apiGetMe as getStudentProfile,
  apiGetMyProgress as getStudentProgress,
  apiGetDashboardStats as getStudentStats,
  apiGetRoadmap as getStudentRoadmap,
  apiGetProgressDashboard as getStudentEngagement,
  apiGetMyRank as getStudentRanking,
} from '../api/api';
