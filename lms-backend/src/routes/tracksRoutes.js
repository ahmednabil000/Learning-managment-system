const express = require("express");
const router = express.Router();
const tracksController = require("../controllers/tracksController");

router.get("/", tracksController.getTracks);
router.get("/:id", tracksController.getTrackById);
router.post("/", tracksController.createTrack);
router.put("/:id", tracksController.updateTrackById);
router.delete("/:id", tracksController.deleteTrackById);


module.exports = router;
