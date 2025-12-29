const commentService = require("../services/commentService");
const paginationValidator = require("../validations/paginationValidator");
const {
  commentValidator,
  updateCommentValidator,
} = require("../validations/courses/commentValidator");
const logger = require("../config/logger");
module.exports.createComment = async (req, res) => {
  try {
    logger.info("Start createComment");
    console.log(req.body);
    const { error, value } = commentValidator.validate(req.body);
    if (error) {
     
      return res.status(400).json({ message: error.details[0].message });
    }
    const result = await commentService.createComment(req.user.id, value);
    if (result.statusCode) {
      return res.status(result.statusCode).json({ message: result.message });
    }
    logger.info("End createComment");
    return res.status(201).json(result);
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};
module.exports.getCommentById = async (req, res) => {
  try {
    logger.info("Start getCommentById");
    const result = await commentService.getCommentById(req.params.id);
    if (result.statusCode) {
      return res.status(result.statusCode).json({ message: result.message });
    }
    logger.info("End getCommentById");
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
module.exports.getLectureComments = async (req, res) => {
  try {
    logger.info("Start getLectureComments");
    const { error, value } = paginationValidator.validate(req.query);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { page, pageCount } = value;
    const result = await commentService.getLectureComments(
      req.params.lectureId,
      page,
      pageCount
    );
    if (result.statusCode) {
      return res.status(result.statusCode).json({ message: result.message });
    }
    logger.info("End getLectureComments");
    return res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

module.exports.updateCommentById = async (req, res) => {
  try {
    logger.info("Start updateCommentById");
    const { error, value } = updateCommentValidator.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const result = await commentService.updateCommentById(
      req.user.id,
      req.params.id,
      value
    );
    if (result.statusCode) {
      return res.status(result.statusCode).json({ message: result.message });
    }
    logger.info("End updateCommentById");
    return res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

module.exports.deleteCommentById = async (req, res) => {
  try {
    logger.info("Start deleteCommentById");
    const result = await commentService.deleteCommentById(
      req.user.id,
      req.params.id
    );
    if (result.statusCode) {
      return res.status(result.statusCode).json({ message: result.message });
    }
    logger.info("End deleteCommentById");
    return res.status(200).json(result);
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};
