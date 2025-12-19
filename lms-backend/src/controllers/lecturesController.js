const lectureService = require("../services/lectureService");
const lectureValidator = require("../validations/lectureValidator");
const paginationValidator = require("../validations/paginationValidator");

module.exports.createLecture = async (req, res) => {
  try {
    const { error, value } = lectureValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const lecture = await lectureService.createLecture(value);
    return res.status(201).json(lecture);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.updateLecture = async (req, res) => {
  try {
    const { error, value } = lectureValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const lecture = await lectureService.updateLecture({
      id: req.params.id,
      ...value,
    });
    return res.status(200).json(lecture);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.deleteLecture = async (req, res) => {
  try {
    const lecture = await lectureService.deleteLecture(req.params.id);
    return res.status(200).json(lecture);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getLectureById = async (req, res) => {
  try {
    const lecture = await lectureService.getLectureById(req.params.id);
    return res.status(200).json(lecture);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getLectures = async (req, res) => {
  try {
    const { page, pageCount, search } = await paginationValidator.validateAsync(
      req.query
    );

    const { lectures, totalItems, totalPages } =
      await lectureService.getAllLectures(page, pageCount, search);

    res.json({
      lectures,
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
    return res.status(500).json({ message: error.message });
  }
};

module.exports.addLessonToLecture = async (req, res) => {
  try {
    const lecture = await lectureService.addLessonToLecture({
      lectureId: req.params.lectureId,
      lessonId: req.body.lessonId,
    });
    return res.status(200).json(lecture);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.deleteLessonFromLecture = async (req, res) => {
  try {
    const lecture = await lectureService.deleteLessonFromLecture({
      lectureId: req.params.lectureId,
      lessonId: req.params.lessonId,
    });
    return res.status(200).json(lecture);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
