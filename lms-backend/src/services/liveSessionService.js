const LiveSession = require("../models/liveSessions");
const Recording = require("../models/recording");
const logger = require("../config/logger");
const { dailyClient } = require("../config/axios");

exports.createSession = async (
  instructorId,
  courseId,
  title,
  description,
  startsAt,
  duration,
  recordingEnabled = false,
  maxParticipants = null
) => {
  const room = await dailyClient.post("/rooms", {
    privacy: "public",
    properties: {
      enable_recording: recordingEnabled ? "cloud" : null,
    },
  });

  const session = new LiveSession({
    courseId,
    roomName: room.data.name,
    title,
    description,
    status: "scheduled",
    startsAt,
    duration,
    createdBy: instructorId,
    recordingEnabled,
    maxParticipants,
  });

  await session.save();
  return session;
};

exports.getSessionByName = async (name) => {
  const room = await dailyClient.get(`/rooms/${name}`);
  if (!room.data || Object.keys(room.data).length === 0) {
    throw new Error("Session not found");
  }

  const session = await LiveSession.findOne({
    roomName: room.data.name,
  }).populate("createdBy", "name");

  if (!session) {
    throw new Error("Session not found");
  }

  return session;
};

exports.getSessions = async (filters = {}) => {
  const query = {};
  if (filters.courseId) {
    query.courseId = filters.courseId;
  }
  return LiveSession.find(query).sort({ startsAt: 1 });
};

exports.updateSession = async (sessionId, userId, updateData) => {
  const session = await LiveSession.findById(sessionId);
  if (!session) {
    return { statusCode: 404, message: "Session not found" };
  }
  if (session.createdBy !== userId) {
    return {
      statusCode: 403,
      message: `Not authorized to update session`,
    };
  }

  const allowedUpdates = [
    "title",
    "description",
    "startsAt",
    "duration",
    "recordingEnabled",
    "maxParticipants",
  ];

  allowedUpdates.forEach((field) => {
    if (updateData[field] !== undefined) {
      session[field] = updateData[field];
    }
  });

  if (
    updateData.recordingEnabled !== undefined &&
    updateData.recordingEnabled !== session.recordingEnabled
  ) {
    // We might need to update Daily.co room properties here if recording setting changes
    // But for now, let's just update the local model as Daily.co rooms are often just "enabled" at creation
    // To strictly sync, we'd call dailyClient.post('/rooms/' + session.roomName, { properties: ... })
    try {
      await dailyClient.post(`/rooms/${session.roomName}`, {
        properties: {
          enable_recording: updateData.recordingEnabled ? "cloud" : "none",
        },
      });
    } catch (error) {
      logger.error(
        `Failed to update daily room recording setting: ${error.message}`
      );
    }
  }

  await session.save();
  return { statusCode: 200, data: session };
};

exports.deleteSessionByName = async (userId, name) => {
  const session = await LiveSession.findOne({ roomName: name });
  if (!session) {
    return { message: "Session not found", statusCode: 404 };
  }
  if (session.createdBy !== userId) {
    return {
      message: `Not authorized to delete session:${name}`,
      statusCode: 403,
    };
  }

  await dailyClient.delete(`/rooms/${name}`);
  await LiveSession.deleteOne({ roomName: name });

  return { data: session, statusCode: 200 };
};

exports.startSessionRecording = async (userId, sessionName) => {
  const session = await LiveSession.findOne({ roomName: sessionName });
  if (!session) {
    return { message: "Session not found", statusCode: 404 };
  }
  if (session.createdBy != userId) {
    return {
      message: `Not authorized to record session:${sessionName}`,
      statusCode: 403,
    };
  }
  if (!session.recordingEnabled) {
    return {
      message: "Recording is not enabled for this session",
      statusCode: 400,
    };
  }

  const result = await dailyClient.post(
    `/rooms/${sessionName}/recordings/start`
  );

  // Create Recording model entry
  const recording = new Recording({
    sessionId: session._id,
    recordingId: result.data.recordingId,
    status: "processing",
  });
  await recording.save();

  // Update session status to live if it's scheduled
  if (session.status === "scheduled") {
    session.status = "live";
    await session.save();
  }

  return result.data;
};

exports.stopSessionRecording = async (userId, sessionName) => {
  const session = await LiveSession.findOne({ roomName: sessionName });
  if (!session) {
    return { message: "Session not found", statusCode: 404 };
  }
  if (session.createdBy != userId) {
    return {
      message: `Not authorized to stop recording session:${sessionName}`,
      statusCode: 403,
    };
  }

  const result = await dailyClient.post(
    `/rooms/${sessionName}/recordings/stop`
  );

  // Update Recording model
  const recording = await Recording.findOne({ sessionId: session._id }).sort({
    createdAt: -1,
  });
  if (recording) {
    recording.duration = result.data.duration;
    recording.status = "completed";
    await recording.save();
  }

  // Update session status and endsAt
  session.status = "ended";
  session.endsAt = new Date();
  await session.save();

  return result.data;
};

exports.getSessionRecording = async (userId, sessionName) => {
  const session = await LiveSession.findOne({ roomName: sessionName });
  if (!session) {
    return { message: "Session not found", statusCode: 404 };
  }
  if (session.createdBy != userId) {
    return {
      message: `Not authorized to access recording for session:${sessionName}`,
      statusCode: 403,
    };
  }

  const recordingDoc = await Recording.findOne({ sessionId: session._id }).sort(
    { createdAt: -1 }
  );
  if (!recordingDoc) {
    return {
      message: "This session has not been recorded",
      statusCode: 404,
    };
  }

  const recording = await dailyClient.get(
    `/recordings/${recordingDoc.recordingId}`
  );
  const accessLink = await dailyClient.get(
    `/recordings/${recordingDoc.recordingId}/access-link`
  );
  recording.data.accessLink = accessLink.data;
  return recording.data;
};

exports.getSessionToken = async (user, sessionName) => {
  const tokenRes = await dailyClient.post("/meeting-tokens", {
    properties: {
      room_name: sessionName,
      user_name: user.name,
      is_owner: user.role === "instructor",
    },
  });

  return tokenRes.data.token;
};

exports.getSessionsByInstructor = async (instructorId) => {
  return LiveSession.find({ createdBy: instructorId });
};

exports.updateSessionStatus = async (sessionId, status) => {
  const allowed = ["scheduled", "live", "ended"];
  if (!allowed.includes(status)) {
    return {
      statusCode: 400,
      message: `Invalid status. Must be one of: ${allowed.join(", ")}`,
    };
  }
  const session = await LiveSession.findById(sessionId);
  if (!session) {
    return { statusCode: 404, message: "Session not found" };
  }
  session.status = status;
  if (status === "ended") {
    session.endsAt = new Date();
  }
  await session.save();
  return { statusCode: 200, data: session };
};
