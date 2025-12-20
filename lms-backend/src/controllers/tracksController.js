const trackService = require("../services/trackService");
const paginationValidator = require("../validations/paginationValidator");
const trackValidator = require("../validations/courses/trackValidator");
const error = require("joi/lib/error");

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
    const { page, pageCount, search } = await paginationValidator.validateAsync(
      req.query
    );

    const { tracks, totalItems, totalPages } = await trackService.getTracks(
      page,
      pageCount,
      search
    );

    res.json({
      tracks,
      page,
      pageCount,
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
    const {
      title,
      description,
      coverImage,
      duration,
      isPublished,
      instructor,
      courses,
    } = await trackValidator.validateAsync(req.body);

    const track = await trackService.createTrack({
      title,
      description,
      coverImage,
      duration,
      isPublished,
      instructor,
      courses,
    });

    res.json(track);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateTrackById = async (req, res) => {
  try {
    const {
      title,
      description,
      coverImage,
      duration,
      isPublished,
      instructor,
      courses,
    } = await trackValidator.validateAsync(req.body);

    const track = await trackService.updateTrackById(req.params.id, {
      title,
      description,
      coverImage,
      duration,
      isPublished,
      instructor,
      courses,
    });

    res.json(track);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTrackById = async (req, res) => {
  try {
    const track = await trackService.deleteTrackById(req.params.id);
    res.json(track);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
