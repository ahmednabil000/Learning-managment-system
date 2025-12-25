const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const scheduledLiveSessionController = require("../controllers/scheduledLiveSessionController");

// Create a new scheduled session
router.post(
  "/",
  authMiddleware,
  scheduledLiveSessionController.createScheduledSession
);

// Get all scheduled sessions with optional filtering
router.get("/", scheduledLiveSessionController.getAllScheduledSessions);

// Get a specific scheduled session by ID
router.get("/:id", scheduledLiveSessionController.getScheduledSessionById);

// Update scheduled session status
router.patch(
  "/:id/status",
  authMiddleware,
  scheduledLiveSessionController.updateScheduledSessionStatus
);

// Update scheduled session (general update)
router.put(
  "/:id",
  authMiddleware,
  scheduledLiveSessionController.updateScheduledSession
);

// Delete a scheduled session
router.delete(
  "/:id",
  authMiddleware,
  scheduledLiveSessionController.deleteScheduledSession
);

module.exports = router;
