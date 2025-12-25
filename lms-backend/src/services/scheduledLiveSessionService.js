const ScheduledLiveSession = require("../models/schedualedLiveSession");
const logger = require("../config/logger");

exports.createScheduledSession = async (instructorId, startsAt) => {
  const scheduledSession = new ScheduledLiveSession({
    instructor: instructorId,
    startsAt: startsAt,
    status: "scheduled",
  });

  await scheduledSession.save();
  return scheduledSession;
};

exports.getScheduledSessionById = async (sessionId) => {
  const session = await ScheduledLiveSession.findById(sessionId)
    .populate("sessionId")
    .populate("instructor");

  if (!session) {
    return { message: "Scheduled session not found", statusCode: 404 };
  }

  return session;
};

exports.getAllScheduledSessions = async (
  page = 1,
  limit = 10,
  instructorId = null
) => {
  const skip = (page - 1) * limit;
  const query = instructorId ? { instructor: instructorId } : {};

  const sessions = await ScheduledLiveSession.find(query)
    .populate("sessionId")
    .populate("instructor")
    .sort({ startsAt: 1 })
    .skip(skip)
    .limit(limit);

  const totalItems = await ScheduledLiveSession.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limit);

  return {
    sessions,
    page,
    limit,
    totalItems,
    totalPages,
  };
};

exports.updateScheduledSessionStatus = async (sessionId, status, userId) => {
  const session = await ScheduledLiveSession.findById(sessionId);

  if (!session) {
    return { message: "Scheduled session not found", statusCode: 404 };
  }

  if (session.instructor.toString() !== userId) {
    return {
      message: "Not authorized to update this scheduled session",
      statusCode: 403,
    };
  }

  const validStatuses = ["scheduled", "live", "finished"];
  if (!validStatuses.includes(status)) {
    return {
      message: "Invalid status. Must be one of: scheduled, live, finished",
      statusCode: 400,
    };
  }

  session.status = status;
  await session.save();

  return session;
};

exports.updateScheduledSession = async (sessionId, updateData, userId) => {
  const session = await ScheduledLiveSession.findById(sessionId);

  if (!session) {
    return { message: "Scheduled session not found", statusCode: 404 };
  }

  if (session.instructor.toString() !== userId) {
    return {
      message: "Not authorized to update this scheduled session",
      statusCode: 403,
    };
  }

  if (updateData.startsAt) {
    session.startsAt = updateData.startsAt;
  }
  if (updateData.status) {
    const validStatuses = ["scheduled", "live", "finished"];
    if (!validStatuses.includes(updateData.status)) {
      return {
        message: "Invalid status. Must be one of: scheduled, live, finished",
        statusCode: 400,
      };
    }
    session.status = updateData.status;
  }
  if (updateData.sessionId) {
    session.sessionId = updateData.sessionId;
  }

  await session.save();
  return session;
};

exports.deleteScheduledSession = async (sessionId, userId) => {
  const session = await ScheduledLiveSession.findById(sessionId);

  if (!session) {
    return { message: "Scheduled session not found", statusCode: 404 };
  }

  if (session.instructor.toString() !== userId) {
    return {
      message: "Not authorized to delete this scheduled session",
      statusCode: 403,
    };
  }

  await ScheduledLiveSession.findByIdAndDelete(sessionId);

  return { message: "Scheduled session deleted successfully", statusCode: 200 };
};
