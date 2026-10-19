
const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");


async function request(endpoint, options = {}) {
  const token = localStorage.getItem("careerforge_token");

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });


  const data = await response.json().catch(() => ({}));


  if (!response.ok) {
    throw new Error(
      data.detail || `Request failed: ${response.status}`
    );
  }

  return data;
}

export const api = {
  getMyProfile: () => request("/auth/me"),
  getApplications: () => request("/applications"),

  createApplication: (application) =>
    request("/applications", {
      method: "POST",
      body: JSON.stringify(application),
    }),

  updateApplication: (id, updates) =>
    request(`/applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }),

  deleteApplication: (id) =>
    request(`/applications/${id}`, {
      method: "DELETE",
    }),
  analyzeResume: (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return fetch(`${API_BASE}/resume/analyze`, {
  method: "POST",
  headers: {
    ...(localStorage.getItem("careerforge_token")
      ? {
          Authorization: `Bearer ${localStorage.getItem("careerforge_token")}`,
        }
      : {}),
  },
  body: formData,
  }).then(async (response) => {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Resume analysis failed"
      );
    }

    return data;
  });
},
matchJob: (payload) =>
  request("/job-match", {
    method: "POST",
    body: JSON.stringify(payload),
  }),
  evaluateInterview: (payload) =>
  request("/interview/evaluate", {
    method: "POST",
    body: JSON.stringify(payload),
  }),

getInterviewQuestions: (category, skills = []) =>
  request(
    `/interview/questions?category=${encodeURIComponent(category)}&skills=${encodeURIComponent(skills.join(","))}`
  ),

};
