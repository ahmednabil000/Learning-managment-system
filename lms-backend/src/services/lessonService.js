const Lesson = require("../models/courses/lesson");
const UserEnroll = require("../models/UserEnroll");
const cloudinary = require("../config/cloudinary");

module.exports.createLesson = async ({
  title,
  description,
  lectureId,
  course,
  order,
  publicId,
  duration,
  isOpen,
}) => {
  const lesson = await Lesson.create({
    title,
    description,
    lecture: lectureId,
    course,
    order,
    publicId,
    duration,
    isOpen,
  });
  return lesson;
};

module.exports.updateLesson = async ({
  id,
  title,
  description,
  lectureId,
  course,
  order,
  duration,
  videoUrl,
  isOpen,
}) => {
  const lesson = await Lesson.findOne({ _id: id });

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  lesson.title = title;
  lesson.description = description;
  lesson.lecture = lectureId;
  lesson.course = course;
  lesson.order = order;
  lesson.duration = duration;
  lesson.videoUrl = videoUrl;
  lesson.isOpen = isOpen;

  await lesson.save();

  return lesson;
};

module.exports.uploadVideo = async (file) => {
  const result = await cloudinary.uploader.upload(file.path, {
    resource_type: "video",
    folder: "lessons",
    type: "authenticated",
    public_id: `lesson_${Date.now()}_${file.originalname?.split(".")[0]}`,
  });
  return result.public_id;
};

module.exports.deleteLesson = async (id) => {
  const lesson = await Lesson.findOne({ _id: id });

  if (!lesson) {
    throw error("Lesson not found");
  }

  await lesson.remove();
  return lesson;
};

module.exports.getLessonById = async (id, userId) => {
  const lesson = await Lesson.findOne({ _id: id }).lean();

  if (!lesson) {
    return { status: 404, message: "Lesson not found" };
  }

  let hasAccess = false;

  if (lesson.isOpen) {
    hasAccess = true;
  } else if (userId) {
    const userEnroll = await UserEnroll.findOne({
      user: userId,
      course: lesson.course,
    });
    if (userEnroll) {
      hasAccess = true;
    }
  }

  if (!hasAccess) {
    if (!userId) {
      return { status: 401, message: "Unauthorized" };
    }
    return { status: 403, message: "You are not enrolled in this course" };
  }

  if (lesson.publicId) {
    const signedUrl = cloudinary.url(lesson.publicId, {
      type: "authenticated",
      resource_type: "video",
      sign_url: true,
      expiration: Math.floor(Date.now() / 1000) + 1800, // 30 minutes
    });
    lesson.url = signedUrl;
  }

  return { status: 200, lesson };
};

module.exports.getLessonsByLectureId = async (lectureId) => {
  const lessons = await Lesson.find({ lecture: lectureId });
  return lessons;
};
