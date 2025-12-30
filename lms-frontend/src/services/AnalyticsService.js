import api from "./api";

/**
 * Get the number of courses created by the instructor within a specific period.
 * @param {Object} params - { startDate, endDate }
 */
export const getCoursesCount = async (params) => {
  const response = await api.get("/analytics/instructor/courses-count", {
    params,
  });
  return response.data;
};

/**
 * Get the total number of enrollments across all the instructor's courses.
 * @param {Object} params - { startDate, endDate }
 */
export const getEnrolledUsersCount = async (params) => {
  const response = await api.get("/analytics/instructor/enrolled-users-count", {
    params,
  });
  return response.data;
};

/**
 * Get the total revenue generated from enrollments.
 * @param {Object} params - { startDate, endDate, courseId }
 */
export const getTotalRevenue = async (params) => {
  const response = await api.get("/analytics/instructor/total-revenue", {
    params,
  });
  return response.data;
};

/**
 * Get a detailed breakdown of enrollment counts for each course.
 * @param {Object} params - { startDate, endDate }
 */
export const getEnrollmentsByCourse = async (params) => {
  const response = await api.get(
    "/analytics/instructor/enrollments-by-course",
    {
      params,
    }
  );
  return response.data;
};

/**
 * Get top performing courses based on all-time enrollments.
 * @param {Object} params - { limit }
 */
export const getTopCourses = async (params) => {
  const response = await api.get("/analytics/instructor/top-courses", {
    params,
  });
  return response.data;
};

/**
 * Get the average rating of all courses taught by the instructor.
 */
export const getInstructorRate = async () => {
  const response = await api.get("/analytics/instructor/instructor-rate");
  return response.data;
};
