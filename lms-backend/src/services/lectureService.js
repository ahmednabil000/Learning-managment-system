const mongoose = require("mongoose");
const Lecture = require("../models/courses/lecture");

exports.createLecture = async ({ title, description, courseId, order }) => {
  try {
    const lecture = await Lecture.create({
      title,
      description,
      course: courseId,
      order,
    });
    return lecture;
  } catch (error) {}
};

exports.updateLecture = async ({ id, title, description, courseId, order }) => {
  const lecture = await Lecture.findOne({ _id: id });

  if (!lecture) {
    throw error("Lecture not found");
  }

  lecture.title = title;
  lecture.description = description;
  lecture.course = courseId;
  lecture.order = order;

  await lecture.save();

  return lecture;
};

exports.deleteLecture = async (id) => {
  try {
    const lecture = await Lecture.findOne({ _id: id });

    if (!lecture) {
      throw error("Lecture not found");
    }

    await lecture.deleteOne();
    return lecture;
  } catch (error) {}
};

exports.addLessonToLecture = async ({ lectureId, lessonId }) => {
  const lecture = await Lecture.findOne({ _id: lectureId });

  if (!lecture) {
    throw error("Lecture not found");
  }

  lecture.lessons.push(lessonId);

  await lecture.save();

  return lecture;
};

exports.deleteLessonFromLecture = async ({ lectureId, lessonId }) => {
  const lecture = await Lecture.findOne({ _id: lectureId });

  if (!lecture) {
    throw error("Lecture not found");
  }

  lecture.lessons.pull(lessonId);

  await lecture.save();

  return lecture;
};

exports.getLectureById = async (id) => {
  const lecture = await Lecture.findOne({ _id: id }).populate("lessons");
  return lecture;
};

exports.getLecturesByCourseId = async (courseId) => {
  const { Course } = require("../models");
  const course = await Course.findOne({ _id: courseId });

  if (!course) {
    throw new Error("Course not found");
  }

  const lectures = await Lecture.find({ course: course._id })
    .sort({ order: 1 })
    .populate("lessons");

  return lectures;
};

exports.getAllLectures = async (page, pageCount, search) => {
  const lectures = await Lecture.find({
    title: { $regex: search, $options: "i" },
  })
    .skip((page - 1) * pageCount)
    .limit(pageCount)
    .populate("lessons");

  const totalItems = await Lecture.countDocuments({
    title: { $regex: search, $options: "i" },
  });
  const totalPages = Math.ceil(totalItems / pageCount);

  return {
    lectures,
    totalItems,
    totalPages,
  };
};
