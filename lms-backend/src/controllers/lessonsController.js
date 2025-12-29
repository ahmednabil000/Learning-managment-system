const lessonService = require("../services/lessonService");
const lessonValidator = require("../validations/courses/lessonValidator");
const logger = require("../config/logger");
module.exports.createLesson = async (req, res) => {
  try {
    const { error, value } = lessonValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const lesson = await lessonService.createLesson(value);
    return res.status(201).json(lesson);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.updateLesson = async (req, res) => {
  try {
    const { error, value } = lessonValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const lesson = await lessonService.updateLesson({
      id: req.params.id,
      ...value,
    });
    return res.status(200).json(lesson);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await lessonService.deleteLesson(req.params.id);
    return res.status(200).json(lesson);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getLessonById = async (req, res) => {
  try {
    const lesson = await lessonService.getLessonById(req.params.id);
    return res.status(200).json(lesson);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getLessonsByLectureId = async (req, res) => {
  try {
    logger.info(`Start fetching lessons for lecture :${req.params.lectureId}`);
    const lessons = await lessonService.getLessonsByLectureId(
      req.params.lectureId
    );
    console.log(lessons);
    return res.status(200).json(lessons);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
