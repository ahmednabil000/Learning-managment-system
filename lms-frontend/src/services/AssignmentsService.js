import api from "./api";

const AssignmentsService = {
  // --- Assignment Services ---

  createAssignment: async (data) => {
    // Exclude totalPoints if present
    const { totalPoints: _totalPoints, ...rest } = data;
    const response = await api.post("/assignments", rest);
    return response.data;
  },

  getAssignmentById: async (id) => {
    const response = await api.get(`/assignments/${id}`);
    return response.data;
  },

  updateAssignment: async (id, data) => {
    // Exclude totalPoints if present
    const { totalPoints: _totalPoints, ...rest } = data;
    const response = await api.put(`/assignments/${id}`, rest);
    return response.data;
  },

  deleteAssignment: async (id) => {
    const response = await api.delete(`/assignments/${id}`);
    return response.data;
  },

  getAssignmentsByCourse: async (courseId, params = {}) => {
    const response = await api.get("/assignments/by-course", {
      params: { courseId, ...params },
    });
    return response.data;
  },

  getAssignmentsByLecture: async (lectureId) => {
    const response = await api.get(`/assignments/by-lecture/${lectureId}`);
    return response.data;
  },

  // --- Question Services ---

  createQuestion: async (data) => {
    const response = await api.post("/questions", data);
    return response.data;
  },

  getQuestionsByAssignment: async (assignmentId) => {
    const response = await api.get(`/questions/assignment/${assignmentId}`);
    return response.data;
  },

  getQuestionById: async (id) => {
    const response = await api.get(`/questions/${id}`);
    return response.data;
  },

  updateQuestion: async (id, data) => {
    const allowedFields = [
      "title",
      "assignment",
      "exam",
      "type",
      "options",
      "correctAnswer",
      "points",
    ];
    const payload = {};
    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        payload[field] = data[field];
      }
    });
    const response = await api.put(`/questions/${id}`, payload);
    return response.data;
  },

  deleteQuestion: async (id) => {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
  },

  // --- Answer Services ---

  createAnswer: async (data) => {
    const response = await api.post("/answers", data);
    return response.data;
  },

  getAnswerById: async (id) => {
    const response = await api.get(`/answers/${id}`);
    return response.data;
  },

  updateAnswer: async (id, data) => {
    const response = await api.put(`/answers/${id}`, data);
    return response.data;
  },

  deleteAnswer: async (id) => {
    const response = await api.delete(`/answers/${id}`);
    return response.data;
  },
};

export default AssignmentsService;
