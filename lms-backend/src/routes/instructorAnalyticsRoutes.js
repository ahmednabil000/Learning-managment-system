const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/instructorAnalyticsController");
const authMiddleware = require("../middlewares/authMiddleware");

// All routes require authentication (and ideally Instructor role, handled by ownership checks in service)
router.use(authMiddleware);

router.get("/courses-count", analyticsController.getCoursesCount);
router.get("/enrolled-users-count", analyticsController.getEnrolledUsersCount);
router.get(
  "/total-revenue",
  authMiddleware,
  analyticsController.getTotalRevenue
);
router.get(
  "/enrollments-by-course",
  analyticsController.getCoursesEnrolledCount
);
router.get("/top-courses", analyticsController.getTopCourses);
router.get("/instructor-rate", analyticsController.getInstructorRate);

module.exports = router;
