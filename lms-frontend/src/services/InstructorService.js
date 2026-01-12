import api from "./api";

const InstructorService = {
  getInstructorById: async (id) => {
    const response = await api.get(`/instructors/${id}`);
    return response.data;
  },

  getInstructorCoursesPublic: async (instructorId, page = 1, limit = 10) => {
    const response = await api.get(`/courses/instructor/${instructorId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  updateInstructor: async (data) => {
    const response = await api.put("/instructors/", data);
    return response.data;
  },
};

export default InstructorService;
