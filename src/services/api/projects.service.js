import { apiGetAllProjects, apiGetMyProjects } from './api';

export const projectsService = {
  getAll: async ({ search, status } = {}) => {
    const token = localStorage.getItem('token');
    const params = {};
    if (search) params.search = search;
    if (status) params.status = status;

    // If user is authenticated, prefer the "my projects" endpoint
    if (token) {
      try {
        const myRes = await apiGetMyProjects(params);
        const myData = myRes?.data || myRes?.projects || myRes;
        console.debug('[projectsService] using my-projects endpoint, count=', Array.isArray(myData) ? myData.length : (myData?.length || 0), 'params=', params);
        return myData;
      } catch (err) {
        console.warn('[projectsService] apiGetMyProjects failed, falling back to public endpoint', err?.message || err);
        try {
          const publicRes = await apiGetAllProjects(params);
          const publicData = publicRes?.data || publicRes?.projects || publicRes;
          console.debug('[projectsService] using public projects endpoint after fallback, count=', Array.isArray(publicData) ? publicData.length : (publicData?.length || 0), 'params=', params);
          return publicData;
        } catch (e) {
          console.error('[projectsService] public projects endpoint failed too', e?.message || e);
          return [];
        }
      }
    }

    // Not authenticated — return public projects
    try {
      const res = await apiGetAllProjects(params);
      const data = res?.data || res?.projects || res;
      console.debug('[projectsService] unauthenticated public projects count=', Array.isArray(data) ? data.length : (data?.length || 0), 'params=', params);
      return data;
    } catch (err) {
      console.error('[projectsService] apiGetAllProjects failed', err?.message || err);
      return [];
    }
  },
};
