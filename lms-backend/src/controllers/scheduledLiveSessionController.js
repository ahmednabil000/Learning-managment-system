const scheduledLiveSessionService = require("../services/scheduledLiveSessionService");
const logger = require("../config/logger");

module.exports.createScheduledSession = async (req, res) => {
  try {
    logger.info("Start creating scheduled live session");
    const { startsAt } = req.body;

    if (!startsAt) {
      return res.status(400).json({ message: "startsAt is required" });
    }

    const session = await scheduledLiveSessionService.createScheduledSession(
      req.user.id,
      startsAt
    );

    res.status(201).json(session);
    logger.info("End creating scheduled live session");
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      error: error.message || "Failed to create scheduled session",
    });
  }
};

module.exports.getScheduledSessionById = async (req, res) => {
  try {
    logger.info(`Start fetching scheduled session ${req.params.id}`);
    const session = await scheduledLiveSessionService.getScheduledSessionById(
      req.params.id
    );

    if (session.statusCode) {
      return res.status(session.statusCode).json({ message: session.message });
    }

    logger.info(`End fetching scheduled session ${req.params.id}`);
    res.status(200).json(session);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      error: error.message || "Failed to fetch scheduled session",
    });
  }
};

module.exports.getAllScheduledSessions = async (req, res) => {
  try {
    logger.info("Start fetching all scheduled sessions");
    const { page = 1, limit = 10, instructorId } = req.query;

    const result = await scheduledLiveSessionService.getAllScheduledSessions(
      parseInt(page),
      parseInt(limit),
      instructorId
    );

    logger.info("End fetching all scheduled sessions");
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      error: error.message || "Failed to fetch scheduled sessions",
    });
  }
};

module.exports.updateScheduledSessionStatus = async (req, res) => {
  try {
    logger.info(`Start updating status for scheduled session ${req.params.id}`);
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }

    const result =
      await scheduledLiveSessionService.updateScheduledSessionStatus(
        req.params.id,
        status,
        req.user.id
      );

    if (result.statusCode) {
      return res.status(result.statusCode).json({ message: result.message });
    }

    logger.info(`End updating status for scheduled session ${req.params.id}`);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      error: error.message || "Failed to update scheduled session status",
    });
  }
};

module.exports.updateScheduledSession = async (req, res) => {
  try {
    logger.info(`Start updating scheduled session ${req.params.id}`);
    const updateData = req.body;

    const result = await scheduledLiveSessionService.updateScheduledSession(
      req.params.id,
      updateData,
      req.user.id
    );

    if (result.statusCode) {
      return res.status(result.statusCode).json({ message: result.message });
    }

    logger.info(`End updating scheduled session ${req.params.id}`);
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      error: error.message || "Failed to update scheduled session",
    });
  }
};

module.exports.deleteScheduledSession = async (req, res) => {
  try {
    logger.info(`Start deleting scheduled session ${req.params.id}`);
    const result = await scheduledLiveSessionService.deleteScheduledSession(
      req.params.id,
      req.user.id
    );

    logger.info(`End deleting scheduled session ${req.params.id}`);
    res.status(result.statusCode).json({ message: result.message });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      error: error.message || "Failed to delete scheduled session",
    });
  }
};
