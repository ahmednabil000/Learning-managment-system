const trackService = require("../services/trackService");
const paginationValidator = require("../validations/paginationValidator");
const trackValidator = require("../validations/courses/trackValidator");
const logger = require("../config/logger");
exports.getTrackById = async (req, res) => {
  try {
    const track = await trackService.getTrackById(req.params.id);
    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }
    res.json(track);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTracks = async (req, res) => {
  try {
    const { error, value } = paginationValidator.validate(req.query);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { page, pageCount: limit, search } = value;
    const offset = (page - 1) * limit;

    const { tracks, totalItems, totalPages } = await trackService.getAllTracks(
      offset,
      limit,
      search
    );

    res.json({
      tracks,
      page,
      pageCount: limit,
      totalItems,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTrack = async (req, res) => {
  try {
    const { error, value } = trackValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { title, description, thumbnail, discount } = value;

    const track = await trackService.createTrack({
      userId: req.user.id,
      title,
      description,
      thumbnail,
      discount,
    });

    res.json(track);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateTrackById = async (req, res) => {
  try {
    // Note: trackValidator requires 'courses' and 'user' usually, but for update we might accept partials.
    // However, the validator provided is for full object. We might want to separate validation or allow unknown.
    // For now, let's use the validator but we might need to suppress errors for missing 'user' if it's in body,
    // but typically we don't send 'user' in update.
    // The service handles specific fields. Let's validate only what we send or allow validation to pass if we construct the object fully.
    // Actually, usually we validate `req.body` against a specific update schema.
    // Since the user said "note there is trackvalidator you should use it when reciveing inputs form the request", I will use it.
    // I made specific fields optional in the service, but the validator makes them required?
    // Looking at validator: title required, description required.
    // So for update, we expect full payload or strict validation. Let's assume full payload or we handle joi options.
    // I'll validate req.body against trackValidator, but allow 'user' to be injected or ignored if not present since we use req.user.id.
    // Wait, validator says user is required. So I must inject it.

    const payload = { ...req.body, user: req.user.id };
    const { error, value } = trackValidator.validate(payload, {
      allowUnknown: true,
    }); // allow unknown for safety
    if (error) {
      // If partial updates are allowed, this validator is too strict (required fields).
      // But assuming full update or strict compliance.
      return res.status(400).json({ message: error.details[0].message });
    }

    const { title, description, thumbnail, isActive, discount } = value;

    const result = await trackService.updateTrackById(
      req.user.id,
      req.params.id,
      {
        title,
        description,
        thumbnail,
        isActive,
        discount,
      }
    );

    if (result.statusCode) {
      return res.status(result.statusCode).json({ message: result.message });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTrackById = async (req, res) => {
  try {
    const result = await trackService.removeTrackById(
      req.user.id,
      req.params.id
    );
    if (result.statusCode) {
      return res.status(result.statusCode).json({ message: result.message });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addCourseToTrack = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }
    const result = await trackService.addCourseToTrack(
      req.user.id,
      req.params.id,
      courseId
    );
    if (result.statusCode) {
      return res.status(result.statusCode).json({ message: result.message });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeCourseFromTrack = async (req, res) => {
  try {
    const { courseId } = req.params;
    const result = await trackService.removeCourseFromTrack(
      req.user.id,
      req.params.id,
      courseId
    );
    if (result.statusCode) {
      return res.status(result.statusCode).json({ message: result.message });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getInstructorTracks = async (req, res) => {
  try {
    logger.info("Getting instructor tracks");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { tracks, totalItems, totalPages } =
      await trackService.getInstructorTracks(
        req.params.instructorId,
        offset,
        limit
      );

    res.json({
      tracks,
      page,
      limit,
      totalItems,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    });
    logger.info("Getting instructor tracks successfully");
  } catch (error) {
    logger.error("Getting instructor tracks failed", error);
    res.status(500).json({ message: error.message });
  }
};
