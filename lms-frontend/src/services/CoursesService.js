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
};

export default CoursesService;
