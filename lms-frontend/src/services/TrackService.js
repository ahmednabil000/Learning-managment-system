import api from "./api";

const TrackService = {
  getAllTracks: async ({
    page = 1,
    pageCount = 10,
    search = "",
    ...filters
  }) => {
    const response = await api.get("/tracks", {
      params: {
        page,
        pageCount,
        search,
        ...filters,
      },
    });
    return response.data;
  },
  getTrackById: async (id) => {
    const response = await api.get(`/tracks/${id}`);
    return response.data;
  },
  getInstructorTracks: async (instructorId, { page = 1, limit = 10 } = {}) => {
    const response = await api.get(`/tracks/instructor/${instructorId}`, {
      params: { page, limit },
    });
    return response.data;
  },
  createTrack: async (trackData) => {
    const response = await api.post("/tracks", trackData);
    return response.data;
  },
  updateTrack: async (id, trackData) => {
    const response = await api.put(`/tracks/${id}`, trackData);
    return response.data;
  },
  deleteTrack: async (id) => {
    const response = await api.delete(`/tracks/${id}`);
    return response.data;
  },
  addCourseToTrack: async (trackId, courseId) => {
    const response = await api.post(`/tracks/${trackId}/courses`, { courseId });
    return response.data;
  },
  removeCourseFromTrack: async (trackId, courseId) => {
    const response = await api.delete(`/tracks/${trackId}/courses/${courseId}`);
    return response.data;
  },
  getTopTracks: async (limit = 10) => {
    const response = await api.get("/tracks/top", {
      params: { limit },
    });
    return response.data;
  },
};

export default TrackService;
