import api from "./api";

const LecturesService = {
  fetchLectures: async ({ page = 1, pageCount = 10, search = "" } = {}) => {
    const response = await api.get("/lectures", {
      params: { page, pageCount, search },
    });
    return response.data;
  },
  fetchLectureById: async (id) => {
    const response = await api.get(`/lectures/${id}`);
    return response.data;
  },
  createLecture: async (lectureData) => {
    const response = await api.post("/lectures", lectureData);
    return response.data;
  },
  updateLecture: async (id, lectureData) => {
    const response = await api.put(`/lectures/${id}`, lectureData);
    return response.data;
  },
  deleteLecture: async (id) => {
    const response = await api.delete(`/lectures/${id}`);
    return response.data;
  },
  addLessonToLecture: async (lectureId, lessonId) => {
    const response = await api.post(`/lectures/${lectureId}/lessons`, {
      lessonId,
    });
    return response.data;
  },
  removeLessonFromLecture: async (lectureId, lessonId) => {
    const response = await api.delete(
      `/lectures/${lectureId}/lessons/${lessonId}`
    );
    return response.data;
  },
  fetchLecturesByCourse: async (courseId) => {
    const response = await api.get(`/lectures/course/${courseId}`);
    return response.data;
  },
};

export default LecturesService;
