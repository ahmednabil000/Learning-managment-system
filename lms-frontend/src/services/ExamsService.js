import api from "./api";

const ExamsService = {
  createExam: async (data) => {
    const response = await api.post("/exams", data);
    return response.data.data;
  },

  deleteExam: async (id) => {
    const response = await api.delete(`/exams/${id}`);
    return response.data;
  },

  addQuestion: async (examId, data) => {
    const response = await api.post(`/exams/${examId}/questions`, data);
    return response.data.data;
  },

  removeQuestion: async (examId, questionId) => {
    const response = await api.delete(
      `/exams/${examId}/questions/${questionId}`
    );
    return response.data;
  },

  getCourseAvailableExam: async (courseId) => {
    const response = await api.get(`/exams/course/${courseId}/available`);
    return response.data.data;
  },

  getExamsByCourse: async (courseId) => {
    const response = await api.get(`/exams/course/${courseId}`);
    return response.data.data;
  },

  getExamDuration: async (examId) => {
    const response = await api.get(`/exams/${examId}/duration`);
    return response.data.data;
  },

  startAttempt: async (examId, data = {}) => {
    const response = await api.post(`/exams/${examId}/attempt`, data);
    return response.data.data;
  },

  submitAnswer: async (attemptId, data) => {
    const response = await api.post(`/exams/attempt/${attemptId}/answer`, data);
    return response.data.data;
  },

  endAttempt: async (attemptId) => {
    const response = await api.post(`/exams/attempt/${attemptId}/end`);
    return response.data.data;
  },

  getAttempt: async (attemptId) => {
    const response = await api.get(`/exams/attempt/${attemptId}`);
    return response.data.data;
  },
};

export default ExamsService;
