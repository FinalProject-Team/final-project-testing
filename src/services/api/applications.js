const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://final-project-backend-production-214a.up.railway.app";

export const getApplications = async (token) => {
  const res = await fetch(`${BASE_URL}/applications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const acceptApplication = async (id, token) => {
  const res = await fetch(
    `${BASE_URL}/applications/${id}/accept`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.json();
};

export const rejectApplication = async (id, token) => {
  const res = await fetch(
    `${BASE_URL}/applications/${id}/reject`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.json();
};