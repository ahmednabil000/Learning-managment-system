const LiveSession = require("../models/liveSessions");
const logger = require("../config/logger");
const { dailyClient } = require("../config/axios");
const liveSessions = require("../models/liveSessions");
const SehedualedLiveSession = require("../models/schedualedLiveSession");

exports.createSession = async (instructorId, title, description) => {
  console.log("recived");
  const room = await dailyClient.post("/rooms", {
    privacy: "public",
    properties: {
      enable_recording: "cloud",
    },
  });

  const session = await LiveSession.insertOne({
    roomId: room.data.id,
    instructor: instructorId,
    roomName: room.data.name,
    title,
    description,
  });

  return session;
};

exports.getSessionByName = async (name) => {
  const room = await dailyClient.get(`/rooms/${name}`);
  if (!room.data || Object.keys(room.data).length === 0) {
    throw new Error("Session not found");
  }
  console.log(room);
  const session = await LiveSession.findOne({ roomName: room.data.name });
  console.log(session);
  if (!session) {
    throw new Error("Session not found");
  }

  return session;
};

exports.deleteSessionByName = async (userId, name) => {
  const session = await LiveSession.findOne({ roomName: name });
  if (!session) {
    return { message: "Session not found", statusCode: 404 };
  }
  if (session.instructor !== userId) {
    return {
      message: `Not authorized to delete session:${name}`,
      statusCode: 403,
    };
  }

  await dailyClient.delete(`/rooms/${name}`);
  await LiveSession.deleteOne({ roomName: name });

  return session;
};

exports.startSessionRecording = async (userId, sessionName) => {
  const session = await liveSessions.findOne({ roomName: sessionName });
  if (!session) {
    return { message: "Session not found", statusCode: 404 };
  }
  if (session.instructor != userId) {
    return { message: `Not authorized to record session:${sessionName}` };
  }
  console.log("rec");
  const result = await dailyClient.post(
    `/rooms/${sessionName}/recordings/start`
  );
  session.recordingId = result.data.recordingId;
  await session.save();
  return result.data;
};

exports.stopSessionRecording = async (userId, sessionName) => {
  const session = await liveSessions.findOne({ roomName: sessionName });
  if (!session) {
    return { message: "Session not found", statusCode: 404 };
  }
  if (session.instructor != userId) {
    return {
      message: `Not authorized to stop recording session:${sessionName}`,
      statusCode: 403,
    };
  }

  const result = await dailyClient.post(
    `/rooms/${sessionName}/recordings/stop`
  );
  return result.data;
};

exports.getSessionRecording = async (userId, sessionName) => {
  const session = await liveSessions.findOne({ roomName: sessionName });
  if (!session) {
    return { message: "Session not found", statusCode: 404 };
  }
  if (session.instructor != userId) {
    return {
      message: `Not authorized to stop recording session:${sessionName}`,
      statusCode: 403,
    };
  }
  if (!session.recordingId) {
    return {
      message: "This session has not been recorded",
      statusCode: 404,
    };
  }

  const recording = await dailyClient.get(`/recordings/${session.recordingId}`);
  const accessLink = await dailyClient.get(
    `/recordings/${session.recordingId}/access-link`
  );
  recording.data.accessLink = accessLink.data;
  return recording.data;
};

exports.schedualeLiveSession = async (userId, startsAtDate) => {
  const scedueledSession = await SehedualedLiveSession.insertOne({
    instructor: userId,
    startsAt: startAtDate,
  });
  return scedueledSession;
};

exports.getSessionToken = async (user, sessionName) => {
  console.log("rec");
  const tokenRes = await dailyClient.post("/meeting-tokens", {
    properties: {
      room_name: sessionName,
      user_name: user.name,
      is_owner: user.role === "instructor",
    },
  });

  return tokenRes.data.token;
};
