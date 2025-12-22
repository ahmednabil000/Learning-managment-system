import api from "./api";

const TagsService = {
  fetchTags: async ({ page = 1, pageCount = 100, search = "" } = {}) => {
    const response = await api.get("/course-tags", {
      params: { page, pageCount, search },
    });
    return response.data;
  },
  fetchTagById: async (id) => {
    const response = await api.get(`/course-tags/${id}`);
    return response.data;
  },
  createTag: async (tagData) => {
    const response = await api.post("/course-tags", tagData);
    return response.data;
  },
  updateTag: async (id, tagData) => {
    const response = await api.put(`/course-tags/${id}`, tagData);
    return response.data;
  },
  deleteTag: async (id) => {
    const response = await api.delete(`/course-tags/${id}`);
    return response.data;
  },
};

export default TagsService;
