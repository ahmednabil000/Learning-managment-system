const LiveSessionService = require("../services/liveSessionService");
const logger = require("../config/logger");

module.exports.createSession = async (req, res) => {
  try {
    logger.info("Start create live session");
    const { title, description } = req.body;
    const session = await LiveSessionService.createSession(
      req.user.id,
      title,
      description
    );

    res.status(201).json(session);
    logger.info("End create live session");
  } catch (error) {
    logger.error(error.message);
    res
      .status(500)
      .json({ error: error.message || "Failed to create session room" });
  }
};

module.exports.getSessionByName = async (req, res) => {
  try {
    logger.info(`Start fetching session ${req.params.sessionName}`);
    const session = await LiveSessionService.getSessionByName(
      req.params.sessionName
    );
    logger.info(`End fetching session ${req.params.sessionName}`);
    res.status(200).json(session);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json(error.message);
  }
};

module.exports.deleteSessionByName = async (req, res) => {
  try {
    logger.info(`Start deleting session ${req.params.sessionName}`);
    const result = await LiveSessionService.deleteSessionByName(
      req.user.id,
      req.params.sessionName
    );
    logger.info(`End deleting session ${req.params.sessionName}`);
    if (result.statusCode == 200) res.status(200).json(result.data);
    res.status(result.statusCode).json({ message: result.message });
  } catch (error) {
    logger.error(error.message);
    res
      .status(500)
      .json({ error: error.message || "Failed to delete session" });
  }
};

module.exports.startSessionRecording = async (req, res) => {
  try {
    logger.info(`Start recording session ${req.params.sessionName}`);
    const result = await LiveSessionService.startSessionRecording(
      req.user.id,
      req.params.sessionName
    );
    logger.info(`End recording session ${req.params.sessionName}`);
    if (result.statusCode) {
      return res.status(result.statusCode).json({ message: result.message });
    }
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    res
      .status(500)
      .json({ error: error.message || "Failed to start session recording" });
  }
};

module.exports.stopSessionRecording = async (req, res) => {
  try {
    logger.info(`Stop recording session ${req.params.sessionName}`);
    const result = await LiveSessionService.stopSessionRecording(
      req.user.id,
      req.params.sessionName
    );
    logger.info(`Stopped recording session ${req.params.sessionName}`);
    if (result.statusCode) {
      return res.status(result.statusCode).json({ message: result.message });
    }
    res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    res
      .status(500)
      .json({ error: error.message || "Failed to stop session recording" });
  }
};

module.exports.getSessionRecording = async (req, res) => {
  try {
    logger.info(
      `Start fetching recording for session:${req.params.sessionName}`
    );
    const result = await LiveSessionService.getSessionRecording(
      req.user?.id,
      req.params.sessionName
    );

    logger.info(
      `Finish fetching recording for session:${req.params.sessionName}`
    );
    if (result.statusCode) {
      return res.status(result.statusCode).json({ message: result.message });
    }
    return res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
  }
};

module.exports.getSessionToken = async (req, res) => {
  try {
    logger.info(
      `Start getting session token for session:${req.params.sessionName}`
    );

    const token = await LiveSessionService.getSessionToken(
      req.user,
      req.params.sessionName
    );

    logger.info(
      `Finish getting session token for session:${req.params.sessionName}`
    );
    res.status(200).json({ token });
  } catch (error) {
    logger.error(error.message);
    res
      .status(500)
      .json({ error: error.message || "Failed to get session token" });
  }
};
