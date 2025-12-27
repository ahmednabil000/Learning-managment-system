import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DailyIframe from "@daily-co/daily-js";
import {
  useSessionDetails,
  useStartRecording,
  useStopRecording,
  useDeleteSession,
  useUpdateStatus,
} from "../../hooks/useLiveSessions";
import useAuthStore from "../../Stores/authStore";
import LiveSessionsService from "../../services/LiveSessionsService";
import Button from "../../shared/components/Button";
import {
  FaVideo,
  FaMicrophone,
  FaDesktop,
  FaTimes,
  FaCircle,
  FaUserShield,
} from "react-icons/fa";

const LiveSessionPage = () => {
  const { sessionName } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { data: session, isLoading, error } = useSessionDetails(sessionName);
  const [callObject, setCallObject] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const containerRef = useRef(null);

  const startRecordingMutation = useStartRecording();
  const stopRecordingMutation = useStopRecording();

  const deleteSessionMutation = useDeleteSession();
  const updateStatusMutation = useUpdateStatus();

  // Updated to use createdBy based on new API model
  const isOwner = session?.createdBy === user?.id;

  // Join Flow
  const handleJoin = async () => {
    if (callObject) return;

    if (!isAuthenticated) {
      navigate("/auth/login", {
        state: { from: `/live-session/${sessionName}` },
      });
      return;
    }

    setIsJoining(true);

    try {
      const { token: sessionToken } = await LiveSessionsService.getSessionToken(
        sessionName,
        user.name
      );

      // Double check if callObject exists before creating (rare race condition prevention)
      if (callObject) return;

      const co = DailyIframe.createFrame(containerRef.current, {
        iframeStyle: {
          width: "100%",
          height: "100%",
          border: "0",
          borderRadius: "1rem",
        },
        showLeaveButton: true,
        showRecordingControl: false,
        showRecordingControls: false,
        showPeopleButton: true,
      });

      setCallObject(co);

      const dailyDomain =
        import.meta.env.VITE_DAILY_DOMAIN || "lms-daily.daily.co";
      const roomUrl = `https://${dailyDomain}/${session.roomName}`;

      await co.join({
        url: roomUrl,
        token: sessionToken,
        userName: user.name,
      });

      setIsJoined(true);
    } catch (err) {
      console.error("Failed to join session:", err);
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!callObject) return;

    // Leave the Daily call first to ensure clean UI capability
    callObject.leave();
    callObject.destroy();
    setCallObject(null);
    setIsJoined(false);

    if (isOwner && session) {
      try {
        // 1. Mark as ended
        await updateStatusMutation.mutateAsync({
          id: session._id,
          status: "ended",
        });

        // 2. Delete the session (if that's the desired workflow to remove it completely)
        // Note: Usually "ending" is enough, but user requested "delete".
        // Using roomName as per hook requirement/API check previously
        await deleteSessionMutation.mutateAsync(session.roomName);

        // No toast needed here as hooks might have them, but we want to navigate
      } catch (err) {
        console.error("Failed to auto-end/delete session:", err);
      }
    }

    navigate(-1);
  };

  useEffect(() => {
    return () => {
      if (callObject) {
        callObject.destroy();
      }
    };
  }, [callObject]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );

  if (error || !session)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 bg-surface rounded-2xl border border-border shadow-xl">
          <FaTimes className="text-error mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-text-main mb-2">
            Session Not Found
          </h2>
          <p className="text-text-muted mb-6">
            The live session you're looking for doesn't exist or has been
            removed.
          </p>
          <Button onClick={() => navigate("/")} variant="primary">
            Go Home
          </Button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-background flex flex-col p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${
                session.status === "live"
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-blue-500 text-white"
              }`}
            >
              <FaCircle size={8} /> {session.status.toUpperCase()}
            </span>
            <span className="text-text-muted text-sm font-medium">
              Room: {session.roomName}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-text-main tracking-tight">
            {session.course?.title
              ? `Live: ${session.course.title}`
              : "Live Session"}
          </h1>
          <p className="text-text-muted mt-2 max-w-2xl">
            {/* Fallback description since API removed it */}
            Join the interactive session for real-time discussion and learning.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isJoined ? (
            <Button
              variant="danger"
              onClick={handleLeave}
              className="flex items-center gap-2"
            >
              <FaTimes /> Leave Session
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={handleJoin}
              disabled={session.status === "ended" || isJoining}
              className="px-8 shadow-lg shadow-primary/20"
              isLoading={isJoining}
            >
              {session.status === "ended" ? "Session Ended" : "Join Now"}
            </Button>
          )}

          {isJoined && isOwner && session.recordingEnabled && (
            <Button
              variant={
                startRecordingMutation.isPending ||
                stopRecordingMutation.isPending
                  ? "outline"
                  : "secondary"
              }
              onClick={() => {
                if (session.recordingStatus === "recording") {
                  stopRecordingMutation.mutate(sessionName);
                } else {
                  startRecordingMutation.mutate(sessionName);
                }
              }}
              className="flex items-center gap-2"
            >
              <FaVideo
                className={
                  session.recordingStatus === "recording"
                    ? "text-red-500 animate-pulse"
                    : ""
                }
              />
              {session.recordingStatus === "recording"
                ? "Stop Recording"
                : "Start Recording"}
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full min-h-[600px] bg-surface border border-border rounded-3xl overflow-hidden relative shadow-2xl">
        {!isJoined && !isJoining ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-linear-to-br from-background to-surface">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
              <FaVideo size={40} />
            </div>
            <h3 className="text-2xl font-bold text-text-main mb-4">
              Ready to join the live session?
            </h3>
            <p className="text-text-muted max-w-md mb-8">
              Make sure your camera and microphone are working. You will be
              asked for permission once you click join.
            </p>
            <div className="flex gap-4 text-text-muted mb-8">
              <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-lg border border-border">
                <FaMicrophone /> <span>Audio Ready</span>
              </div>
              <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-lg border border-border">
                <FaVideo /> <span>Video Ready</span>
              </div>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleJoin}
              disabled={session.status === "ended"}
            >
              Join Session
            </Button>
          </div>
        ) : null}

        <div
          ref={containerRef}
          className="absolute inset-0 w-full h-full bg-black/5"
        />
      </div>

      {/* Footer Info */}
      <div className="max-w-7xl mx-auto w-full mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-2xl border border-border">
          <div className="flex items-center gap-3 text-primary mb-4 font-bold">
            <FaUserShield /> <span>Instructor</span>
          </div>
          <p className="text-text-main font-bold">Session hosted by</p>
          <p className="text-text-muted">
            {/* Updated to createdBy */}
            Instructor User ID: {session.createdBy}
          </p>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-border">
          <div className="flex items-center gap-3 text-primary mb-4 font-bold">
            <FaDesktop /> <span>Live Stream</span>
          </div>
          <p className="text-text-main font-bold">Recording Status</p>
          <p className="text-text-muted">
            {session.recordingEnabled
              ? session.recordingStatus === "recording"
                ? "Currenty Recording..."
                : "Recording Enabled"
              : "Recording Disabled"}
          </p>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-border">
          <div className="flex items-center gap-3 text-primary mb-4 font-bold">
            <FaTimes /> <span>Rules</span>
          </div>
          <p className="text-text-main font-bold">Code of Conduct</p>
          <p className="text-text-muted">
            Please be respectful to the host and participants.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveSessionPage;
