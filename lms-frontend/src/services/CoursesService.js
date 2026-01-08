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
};

export default CoursesService;
