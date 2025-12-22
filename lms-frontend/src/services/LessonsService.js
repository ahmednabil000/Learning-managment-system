import api from "./api";

const LessonsService = {
  fetchLessonById: async (id) => {
    const response = await api.get(`/lessons/${id}`);
    return response.data;
  },
  fetchLessonsByLecture: async (lectureId) => {
    const response = await api.get(`/lessons/${lectureId}/lessons`);
    return response.data;
  },
  createLesson: async (lessonData) => {
    const response = await api.post("/lessons", lessonData);
    return response.data;
  },
  updateLesson: async (id, lessonData) => {
    const response = await api.put(`/lessons/${id}`, lessonData);
    return response.data;
  },
  deleteLesson: async (id) => {
    const response = await api.delete(`/lessons/${id}`);
    return response.data;
  },
};

export default LessonsService;
