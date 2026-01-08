import api from "./api";

const CourseBlogService = {
  createBlog: async (data) => {
    const response = await api.post("/course-blogs", data);
    return response.data;
  },

  getAllBlogs: async (courseId, params) => {
    const response = await api.get(`/course-blogs/course/${courseId}`, {
      params,
    });
    return response.data;
  },

  getBlogById: async (id) => {
    const response = await api.get(`/course-blogs/${id}`);
    return response.data;
  },

  updateBlog: async (id, data) => {
    const response = await api.put(`/course-blogs/${id}`, data);
    return response.data;
  },

  deleteBlog: async (id) => {
    const response = await api.delete(`/course-blogs/${id}`);
    return response.data;
  },
};

export default CourseBlogService;
