const Track = require("../models/courses/track");
const Course = require("../models/courses/course");

module.exports.createTrack = async ({
  userId,
  thumbnail,
  title,
  discount = 5,
  description,
}) => {
  const track = await Track.create({
    user: userId,
    thumbnail,
    title,
    discount,
    description,
  });
  return track;
};

module.exports.getAllTracks = async (offset, limit, search = "") => {
  const matchStage = search
    ? {
        $match: {
          isActive: true,
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        },
      }
    : { $match: { isActive: true } };

  const tracks = await Track.aggregate([
    matchStage,
    // populate user
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },

    // populate courses
    {
      $lookup: {
        from: "courses",
        localField: "courses",
        foreignField: "_id",
        as: "courses",
      },
    },

    // remove sensitive fields
    {
      $project: {
        "user.googleId": 0,
      },
    },

    { $skip: offset },
    { $limit: limit },
  ]);

  const totalItems = await Track.countDocuments(
    search
      ? {
          isActive: true,
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : { isActive: true }
  );

  const totalPages = Math.ceil(totalItems / limit);
  return { tracks, totalItems, totalPages };
};

module.exports.getTrackById = async (id) => {
  const track = await Track.findOne({ _id: id })
    .populate("user")
    .populate("courses");
  return track;
};

module.exports.updateTrackById = async (
  userId,
  trackId,
  { title, discount, thumbnail, isActive, description }
) => {
  const track = await Track.findOne({ _id: trackId });
  if (!track) {
    return { statusCode: 404, message: "Track not found" };
  }
  if (track.user !== userId) {
    return {
      statusCode: 403,
      message: "You are not authorized to update this track",
    };
  }
  if (isActive && track.courses.length < 2) {
    return {
      statusCode: 400,
      message: "Track can not be active with courses less than 2",
    };
  }
  if (title) track.title = title;
  if (description) track.description = description;
  if (typeof isActive === "boolean") track.isActive = isActive;
  if (thumbnail) track.thumbnail = thumbnail;
  if (discount) track.discount = discount;

  await track.save();
  return track;
};

module.exports.removeTrackById = async (userId, trackId) => {
  const track = await Track.findOne({ _id: trackId });
  if (!track) {
    return { statusCode: 404, message: "Track not found" };
  }
  if (track.user !== userId) {
    return {
      statusCode: 403,
      message: "You are not authorized to remove this track",
    };
  }
  await track.deleteOne();
  return track;
};

module.exports.addCourseToTrack = async (userId, trackId, courseId) => {
  const track = await Track.findOne({ _id: trackId });
  if (!track) {
    return { statusCode: 404, message: "Track not found" };
  }
  if (track.user !== userId) {
    return {
      statusCode: 403,
      message: "You are not authorized to add a course to this track",
    };
  }

  const course = await Course.findOne({ _id: courseId });
  if (!course) {
    return { statusCode: 404, message: "Course not found" };
  }
  if (course.instructor !== userId) {
    return {
      statusCode: 403,
      message: "You are not authorized to add this course to this track",
    };
  }

  if (track.courses.includes(courseId)) {
    return {
      statusCode: 400,
      message: "Course already exists in this track",
    };
  }

  track.courses.push(courseId);
  await track.save();
  return track;
};

module.exports.removeCourseFromTrack = async (userId, trackId, courseId) => {
  const track = await Track.findOne({ _id: trackId });
  if (!track) {
    return { statusCode: 404, message: "Track not found" };
  }
  if (track.user !== userId) {
    return {
      statusCode: 403,
      message: "You are not authorized to remove a course from this track",
    };
  }

  const course = await Course.findOne({ _id: courseId });
  if (!course) {
    return { statusCode: 404, message: "Course not found" };
  }
  if (course.instructor !== userId) {
    return {
      statusCode: 403,
      message: "You are not authorized to remove this course from this track",
    };
  }

  track.courses.pull(courseId);
  await track.save();
  return track;
};
