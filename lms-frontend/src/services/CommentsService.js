import api from "./api";

const CommentsService = {
  createComment: async (data) => {
    const response = await api.post("/comments", data);
    return response.data;
  },

  getComment: async (id) => {
    const response = await api.get(`/comments/${id}`);
    return response.data;
  },

  getLectureComments: async (lectureId, page = 1, pageCount = 10) => {
    const response = await api.get(`/comments/lecture/${lectureId}`, {
      params: { page, pageCount },
    });
    return response.data;
  },

  updateComment: async (id, data) => {
    const response = await api.put(`/comments/${id}`, data);
    return response.data;
  },

  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },
};

export default CommentsService;
