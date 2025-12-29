const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, commentController.createComment);
router.get("/:id", commentController.getCommentById);
router.get("/lecture/:lectureId", commentController.getLectureComments);
router.put("/:id", authMiddleware, commentController.updateCommentById);
router.delete("/:id", authMiddleware, commentController.deleteCommentById);

module.exports = router;
