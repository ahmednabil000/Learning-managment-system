import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import LiveSessionsService from "../../services/LiveSessionsService";
import Button from "../../shared/components/Button";
import {
  FaPlay,
  FaCalendarAlt,
  FaClock,
  FaChevronLeft,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import ReactPlayer from "react-player";
import { format } from "date-fns";

const RecordingPlaybackPage = () => {
  const { sessionName } = useParams();
  const navigate = useNavigate();

  const {
    data: recording,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recording", sessionName],
    queryFn: () => LiveSessionsService.getRecording(sessionName),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <FaSpinner size={48} className="text-primary animate-spin mb-4" />
        <p className="text-text-muted animate-pulse">
          Checking recording status...
        </p>
      </div>
    );
  }

  if (error || !recording) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full bg-surface p-8 rounded-3xl border border-border shadow-xl text-center">
          <FaExclamationTriangle
            className="text-warning mx-auto mb-6"
            size={64}
          />
          <h2 className="text-2xl font-bold text-text-main mb-4">
            No Recording Found
          </h2>
          <p className="text-text-muted mb-8">
            {error?.response?.data?.message ||
              "This session might not have been recorded or the recording is still being processed."}
          </p>
          <Button
            onClick={() => navigate(-1)}
            variant="primary"
            className="w-full"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Handle processing state
  if (recording.status === "processing") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 animate-pulse">
          <FaPlay size={32} />
        </div>
        <h2 className="text-3xl font-black text-text-main mb-2 tracking-tight">
          Recording is Processing
        </h2>
        <p className="text-text-muted max-w-md mb-8">
          The video is being prepared for playback. This usually takes a few
          minutes after the session ends.
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Refresh Page
        </Button>
      </div>
    );
  }

  const isExpired =
    recording.accessLink?.expiresAt &&
    new Date(recording.accessLink.expiresAt) < new Date();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-bold"
        >
          <FaChevronLeft /> Back to Course
        </button>

        <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-border relative">
          {isExpired ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/80 backdrop-blur-md">
              <FaExclamationTriangle className="text-error mb-4" size={48} />
              <h3 className="text-2xl font-bold text-white mb-2">
                Access Link Expired
              </h3>
              <p className="text-gray-400 max-w-md">
                The secure link to this recording has expired. Please refresh
                the page to get a new one.
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="primary"
                className="mt-6"
              >
                Refresh Access
              </Button>
            </div>
          ) : (
            <ReactPlayer
              url={recording.accessLink?.url || recording.downloadLink}
              controls
              width="100%"
              height="100%"
              playing
            />
          )}
        </div>

        <div className="bg-surface p-8 rounded-3xl border border-border shadow-lg">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-black text-text-main tracking-tight">
                Session Recording
              </h1>
              <div className="flex flex-wrap gap-6 text-text-muted">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-primary" />
                  <span>{format(new Date(recording.startedAt), "PPP")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-primary" />
                  <span>{Math.floor(recording.duration / 60)} minutes</span>
                </div>
                <div className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-black uppercase tracking-widest">
                  {recording.status}
                </div>
              </div>
            </div>

            {recording.downloadLink && (
              <a href={recording.downloadLink} download className="self-start">
                <Button variant="outline" className="flex items-center gap-2">
                  Download Video
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordingPlaybackPage;
