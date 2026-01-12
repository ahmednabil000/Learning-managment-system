const express = require("express");
const router = express.Router();
const tracksController = require("../controllers/tracksController");

const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", tracksController.getTracks);
router.get("/top", tracksController.getTopTracks);
router.get("/instructor/:instructorId", tracksController.getInstructorTracks);
router.get("/:id", tracksController.getTrackById);
router.post("/", authMiddleware, tracksController.createTrack);
router.put("/:id", authMiddleware, tracksController.updateTrackById);
router.delete("/:id", authMiddleware, tracksController.deleteTrackById);

router.post("/:id/courses", authMiddleware, tracksController.addCourseToTrack);
router.delete(
  "/:id/courses/:courseId",
  authMiddleware,
  tracksController.removeCourseFromTrack
);

module.exports = router;
