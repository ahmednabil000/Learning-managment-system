import api from "./api";

const LiveSessionsService = {
  // Unified Sessions API
  createSession: async (data) => {
    // data should include: courseId, startsAt, recordingEnabled (optional), maxParticipants (optional)
    const response = await api.post("/sessions", data);
    return response.data;
  },

  getSessionByName: async (sessionName) => {
    const response = await api.get(`/sessions/${sessionName}`);
    return response.data;
  },

  // Assuming GET /sessions exists for listing, based on standard REST practices matching the unified resource
  // List sessions (e.g., filtered by courseId)
  getSessions: async (params) => {
    const response = await api.get("/sessions", { params });
    return response.data;
  },

  getInstructorSessions: async (instructorId) => {
    const response = await api.get(`/sessions/instructor/${instructorId}`);
    return response.data;
  },

  deleteSession: async (sessionName) => {
    const response = await api.delete(`/sessions/${sessionName}`);
    return response.data;
  },

  startRecording: async (sessionName) => {
    const response = await api.post(`/sessions/${sessionName}/start-recording`);
    return response.data;
  },

  stopRecording: async (sessionName) => {
    const response = await api.post(`/sessions/${sessionName}/stop-recording`);
    return response.data;
  },

  getRecording: async (sessionName) => {
    const response = await api.get(`/sessions/${sessionName}/recording`);
    return response.data;
  },

  getSessionToken: async (sessionName) => {
    const response = await api.post(`/sessions/${sessionName}/token`);
    return response.data;
  },

  updateSession: async (id, data) => {
    const response = await api.put(`/sessions/${id}`, data);
    return response.data;
  },

  updateSessionStatus: async (id, status) => {
    const response = await api.put(`/sessions/${id}/status`, { status });
    return response.data;
  },
};

export default LiveSessionsService;
