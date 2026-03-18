const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Something went wrong");
    }
    return response.json();
}

export const api = {
    // Auth
    register: (data: any) => fetchWithAuth("/auth/register", { method: "POST", body: JSON.stringify(data) }),
    login: (credentials: any) => fetchWithAuth("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
    getProfile: () => fetchWithAuth("/profile"),

    // Careers & Skills
    getRecommendations: (skills: string[]) => fetchWithAuth(`/career/recommend?skills=${skills.join(",")}`),
    getSkillGap: (userSkills: string[], roleId: string) => fetchWithAuth("/skills/gap", { method: "POST", body: JSON.stringify({ user_skills: userSkills, role_id: roleId }) }),
    getRoadmap: (roleId: string) => fetchWithAuth(`/roadmap/${roleId}`),

    // Jobs
    getJobs: (location?: string) => fetchWithAuth(`/jobs${location ? `?location=${location}` : ""}`),

    // Resume
    analyzeResume: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`${API_URL}/resume/analyze`, {
            method: "POST",
            body: formData,
        });
        return response.json();
    },

    // Interview
    startInterview: (roleId: string) => fetchWithAuth("/interview/start", { method: "POST", body: JSON.stringify({ role_id: roleId }) }),
    evaluateAnswer: (question: string, answer: string) => fetchWithAuth("/interview/evaluate", { method: "POST", body: JSON.stringify({ question, answer }) }),

    // Analytics
    getAnalyticsOverview: () => fetchWithAuth("/analytics/overview"),
    getAnalyticsDistricts: (state?: string) => fetchWithAuth(`/analytics/districts${state ? `?state=${state}` : ""}`),
};
