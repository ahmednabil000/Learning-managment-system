import api from "./api";

const CoursesService = {
  fetchCourses: async ({
    page = 1,
    pageCount = 10,
    search = "",
    ...filters
  }) => {
    const response = await api.get("/courses", {
      params: {
        page,
        pageCount,
        search,
        ...filters,
      },
    });
    return response.data;
  },
  fetchEnrolledCourses: async ({ page = 1, limit = 10 }) => {
    const response = await api.get("/courses/my-courses", {
      params: { page, limit },
    });
    return response.data;
  },
  fetchCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },
  createCourse: async (courseData) => {
    const response = await api.post("/courses", courseData);
    return response.data;
  },
  updateCourse: async (id, courseData) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },
  deleteCourse: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },
  addDiscount: async (id, discountData) => {
    const response = await api.post(`/courses/${id}/discount`, discountData);
    return response.data;
  },
  removeDiscount: async (id) => {
    const response = await api.delete(`/courses/${id}/discount`);
    return response.data;
  },
  addLearningItem: async (id, data) => {
    const response = await api.post(`/courses/${id}/learning`, data);
    return response.data;
  },
  removeLearningItem: async (id, index) => {
    const response = await api.delete(`/courses/${id}/learning/${index}`);
    return response.data;
  },
  updateLearningItem: async (id, index, data) => {
    const response = await api.put(`/courses/${id}/learning/${index}`, data);
    return response.data;
  },
  addRequirement: async (id, data) => {
    const response = await api.post(`/courses/${id}/requirements`, data);
    return response.data;
  },
  removeRequirement: async (id, index) => {
    const response = await api.delete(`/courses/${id}/requirements/${index}`);
    return response.data;
  },
  updateRequirement: async (id, index, data) => {
    const response = await api.put(
      `/courses/${id}/requirements/${index}`,
      data
    );
    return response.data;
  },
  fetchTopCourses: async (limit = 10) => {
    const response = await api.get(`/courses/top`, {
      params: { limit },
    });
    return response.data;
  },
  fetchInstructorCourses: async (
    instructorId,
    { page = 1, limit = 10, search = "", ...filters }
  ) => {
    const response = await api.get(`/courses/instructor/${instructorId}`, {
      params: { page, limit, search, ...filters },
    });
    return response.data;
  },
};

export default CoursesService;
