const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers
      }
    });
  } catch {
    throw new Error("Cannot reach the API. Check the backend URL and that the server is running.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status}).`);
  }
  return data;
}

export const getInternships = () => request("/internships");
export const getInternship = (id) => request(`/internships/${encodeURIComponent(id)}`);
export const getApplications = () => request("/applications");
export const submitApplication = (payload) => request("/applications", {
  method: "POST",
  body: JSON.stringify(payload)
});
