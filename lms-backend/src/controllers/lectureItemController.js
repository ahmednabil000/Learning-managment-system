const lectureItemService = require("../services/lectureItemService");
const logger = require("../config/logger");

exports.updateItemsOrder = async (req, res) => {
  try {
    logger.info("Updating lecture items order");
    const { lectureId } = req.params;
    const { updatesItems } = req.body;

    if (!updatesItems || !Array.isArray(updatesItems)) {
      return res.status(400).json({ message: "Invalid updatesItems format" });
    }

    const result = await lectureItemService.updateItemsOrder(
      req.user.id,
      lectureId,
      updatesItems
    );

    if (result.statusCode) {
      return res.status(result.statusCode).json({ message: result.message });
    }

    logger.info("Lecture items order updated successfully");
    res.status(200).json(result);
  } catch (error) {
    logger.error("Error updating lecture items order:", error);
    res.status(500).json({ message: error.message });
  }
};
