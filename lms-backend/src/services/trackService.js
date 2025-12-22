exports.getTrackById = async (id) => {
  const track = await Track.findOne({ _id: id });
  return track;
};

exports.getTracks = async ({ page, pageCount, search }) => {
  const tracks = await Track.find({
    title: { $regex: search, $options: "i" },
  })
    .populate("courses")
    .skip((page - 1) * pageCount)
    .limit(pageCount);

  const totalItems = await Track.countDocuments({
    title: { $regex: search, $options: "i" },
  });
  const totalPages = Math.ceil(totalItems / pageCount);

  return {
    tracks,
    totalItems,
    totalPages,
  };
};

exports.createTrack = async ({ title, description, price, imageUrl }) => {
  const track = await Track.create({ title, description, price, imageUrl });
  return track;
};

exports.updateTrack = async ({ id, title, description, price, imageUrl }) => {
  const track = await Track.findOne({ _id: id });

  if (!track) {
    throw error("Track not found");
  }

  track.title = title;
  track.description = description;
  track.price = price;
  track.imageUrl = imageUrl;

  await track.save();

  return track;
};

exports.deleteTrack = async (id) => {
  const track = await Track.findOne({ _id: id });

  if (!track) {
    throw error("Track not found");
  }

  await track.remove();
  return track;
};

exports.addCourseToTrack = async ({ trackId, courseId }) => {
  const track = await Track.findOne({ _id: trackId });

  if (!track) {
    throw error("Track not found");
  }
  const course = await Course.findOne({ id: courseId });

  if (!course) {
    throw error("Course not found");
  }

  track.courses.push(course._id);

  await track.save();

  return track;
};

exports.deleteCourseFromTrack = async ({ trackId, courseId }) => {
  const track = await Track.findOne({ _id: trackId });

  if (!track) {
    throw error("Track not found");
  }
  const course = await Course.findOne({ _id: courseId });

  if (!course) {
    throw error("Course not found");
  }

  track.courses.pull(course._id);

  await track.save();

  return track;
};
