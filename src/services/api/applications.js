import { BASE_URL } from './api';

async function handleJsonResponse(res) {
  const payload = await res.json().catch(() => null);
  if (!res.ok) {
    const message = payload?.message || payload?.error || `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.payload = payload;
    throw error;
  }
  return payload;
}

export const getApplications = async (token) => {
  const res = await fetch(`${BASE_URL}/api/jobs/my/applications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleJsonResponse(res);
};

export const acceptApplication = async (id, token) => {
  const res = await fetch(
    `${BASE_URL}/api/jobs/applications/${id}/status`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'accepted' }),
    }
  );
  return handleJsonResponse(res);
};

export const rejectApplication = async (id, token) => {
  const res = await fetch(
    `${BASE_URL}/api/jobs/applications/${id}/status`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'rejected' }),
    }
  );
  return handleJsonResponse(res);
};