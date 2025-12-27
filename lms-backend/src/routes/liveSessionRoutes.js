const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const liveSessionController = require("../controllers/liveSessionController");

router.post("/", authMiddleware, liveSessionController.createSession);
router.get("/:sessionName", liveSessionController.getSessionByName);
router.delete(
  "/:sessionName",
  authMiddleware,
  liveSessionController.deleteSessionByName
);
router.post(
  "/:sessionName/start-recording",
  authMiddleware,
  liveSessionController.startSessionRecording
);
router.post(
  "/:sessionName/stop-recording",
  authMiddleware,
  liveSessionController.stopSessionRecording
);
router.get(
  "/:sessionName/recording",
  authMiddleware,
  liveSessionController.getSessionRecording
);
router.post(
  "/:sessionName/token",
  authMiddleware,
  liveSessionController.getSessionToken
);
router.get(
  "/instructor/:instructorId",
  liveSessionController.getSessionsByInstructor
);
router.put(
  "/:sessionId/status",
  authMiddleware,
  liveSessionController.updateSessionStatus
);
module.exports = router;
