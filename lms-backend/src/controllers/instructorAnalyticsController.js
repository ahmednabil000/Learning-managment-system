const analyticsService = require("../services/instructorAnalyticsService");
const logger = require("../config/logger");

const getDates = (req) => {
  const { startDate, endDate } = req.query;
  const end = endDate ? new Date(endDate) : new Date();
  const start = startDate
    ? new Date(startDate)
    : new Date(new Date().setDate(end.getDate() - 30));
  return { start, end };
};

module.exports.getCoursesCount = async (req, res) => {
  try {
    const { start, end } = getDates(req);
    const count = await analyticsService.coursesCount(req.user.id, start, end);
    res.json({ count, period: { start, end } });
  } catch (error) {
    logger.error("Error fetching courses count:", error);
    res.status(500).json({ error: "Failed to fetch courses count" });
  }
};

module.exports.getEnrolledUsersCount = async (req, res) => {
  try {
    const { start, end } = getDates(req);
    const count = await analyticsService.enrolledUsersCount(
      req.user.id,
      start,
      end
    );
    res.json({ count, period: { start, end } });
  } catch (error) {
    logger.error("Error fetching enrolled users count:", error);
    res.status(500).json({ error: "Failed to fetch enrolled users count" });
  }
};

module.exports.getTotalRevenue = async (req, res) => {
  try {
    const { start, end } = getDates(req);
    const { courseId } = req.query;
    const revenue = await analyticsService.totalRevenue(
      req.user.id,
      start,
      end,
      courseId
    );
    res.json({ revenue, period: { start, end }, courseId: courseId || "all" });
  } catch (error) {
    logger.error("Error fetching total revenue:", error);
    res.status(500).json({ error: "Failed to fetch total revenue" });
  }
};

module.exports.getCoursesEnrolledCount = async (req, res) => {
  try {
    const { start, end } = getDates(req);
    const data = await analyticsService.getCoursesEnrolledCount(
      req.user.id,
      start,
      end
    );
    res.json({ data, period: { start, end } });
  } catch (error) {
    logger.error("Error fetching courses enrolled count:", error);
    res.status(500).json({ error: "Failed to fetch courses enrolled count" });
  }
};

module.exports.getTopCourses = async (req, res) => {
  try {
    const { limit } = req.query;
    const data = await analyticsService.getTopCourses(req.user.id, limit);
    res.json({ data });
  } catch (error) {
    logger.error("Error fetching top courses:", error);
    res.status(500).json({ error: "Failed to fetch top courses" });
  }
};

module.exports.getInstructorRate = async (req, res) => {
  try {
    const rate = await analyticsService.getInstructorRate(req.user.id);
    res.json({ averageRate: rate || 0 });
  } catch (error) {
    logger.error("Error fetching instructor rate:", error);
    res.status(500).json({ error: "Failed to fetch instructor rate" });
  }
};
