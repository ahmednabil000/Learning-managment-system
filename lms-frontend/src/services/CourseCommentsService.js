import api from "./api";

const CourseCommentsService = {
  /**
   * Create a new comment/rating for a course.
   * @param {Object} data - { course: string, rate: number, content: string }
   */
  createComment: async (data) => {
    const response = await api.post("/course-comments", data);
    return response.data;
  },

  /**
   * Get comments for a specific course.
   * @param {string} courseId
   * @param {Object} params - { page: number, limit: number }
   */
  getCommentsByCourse: async (courseId, params) => {
    const response = await api.get(`/course-comments/course/${courseId}`, {
      params,
    });
    return response.data;
  },

  /**
   * Get the overall average rating for a course.
   * @param {string} courseId
   */
  getCourseAverageRate: async (courseId) => {
    const response = await api.get(`/course-comments/course/${courseId}/rate`);
    return response.data;
  },

  /**
   * Get a single comment by ID.
   * @param {string} id
   */
  getCommentById: async (id) => {
    const response = await api.get(`/course-comments/${id}`);
    return response.data;
  },

  /**
   * Update a comment.
   * @param {string} id
   * @param {Object} data - Partial fields to update { rate, content }
   */
  updateComment: async (id, data) => {
    const response = await api.put(`/course-comments/${id}`, data);
    return response.data;
  },

  /**
   * Delete a comment.
   * @param {string} id
   */
  deleteComment: async (id) => {
    const response = await api.delete(`/course-comments/${id}`);
    return response.data;
  },
};

export default CourseCommentsService;
