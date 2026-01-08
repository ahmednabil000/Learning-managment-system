const express = require("express");
const router = express.Router();
const lectureItemController = require("../controllers/lectureItemController");
const authMiddleware = require("../middlewares/authMiddleware");

// Update items order
router.put(
  "/order/:lectureId",
  authMiddleware,
  lectureItemController.updateItemsOrder
);

module.exports = router;
