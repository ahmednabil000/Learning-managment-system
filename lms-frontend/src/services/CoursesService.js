import api from "./api";

const CoursesService = {
  fetchCourses: async ({ page = 1, pageCount = 10, search = "" }) => {
    const response = await api.get("/courses", {
      params: {
        page,
        pageCount,
        search,
      },
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
};

export default CoursesService;
