import { Link } from "react-router-dom";
import { FaVideo, FaClock, FaCalendarAlt } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import Button from "../../../shared/components/Button";

const LiveSessionBanner = ({ session }) => {
  if (!session) return null;

  const isLive = session.status === "live";
  const isScheduled = session.status === "scheduled";
  const scheduledDate = new Date(session.startsAt);
  const now = new Date();
  const canJoin = isLive || (isScheduled && scheduledDate <= now);

  // Only show live or scheduled sessions
  if (!isLive && !isScheduled) return null;

  return (
    <div
      className={`rounded-2xl p-6 mb-8 border-2 ${
        canJoin
          ? "bg-linear-to-r from-red-500 to-red-600 border-red-400 shadow-lg shadow-red-500/50"
          : "bg-linear-to-r from-blue-500 to-blue-600 border-blue-400 shadow-lg shadow-blue-500/50"
      } text-white animate-in slide-in-from-top duration-500`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${
                canJoin
                  ? "bg-white/20 backdrop-blur-sm animate-pulse"
                  : "bg-white/20 backdrop-blur-sm"
              }`}
            >
              {canJoin && <div className="w-2 h-2 bg-white rounded-full"></div>}
              {canJoin ? "LIVE NOW" : "UPCOMING"}
            </div>
            <FaVideo className="text-white/80" size={20} />
          </div>

          <h3 className="text-2xl font-bold mb-2">{session.title}</h3>

          {session.description && (
            <p className="text-white/90 mb-3 text-sm line-clamp-2">
              {session.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
            {isScheduled && (
              <>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt />
                  <span>{scheduledDate.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock />
                  <span>
                    Starts{" "}
                    {formatDistanceToNow(scheduledDate, { addSuffix: true })}
                  </span>
                </div>
              </>
            )}
            <div className="flex items-center gap-2">
              <FaClock />
              <span>{session.duration} minutes</span>
            </div>
            {session.participants && (
              <div className="flex items-center gap-2">
                <span>👥 {session.participants.length} participants</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 min-w-50">
          {canJoin ? (
            session.roomUrl ? (
              <a
                href={session.roomUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="primary"
                  className="w-full !bg-white !text-red-600 hover:!bg-gray-100 font-bold shadow-xl flex items-center justify-center gap-2 py-3 animate-pulse"
                >
                  <FaVideo /> Join Live Session
                </Button>
              </a>
            ) : (
              <Link to={`/live-session/${session.roomName}`}>
                <Button
                  variant="primary"
                  className="w-full !bg-white !text-red-600 hover:!bg-gray-100 font-bold shadow-xl flex items-center justify-center gap-2 py-3 animate-pulse"
                >
                  <FaVideo /> Join Live Session
                </Button>
              </Link>
            )
          ) : (
            <Button
              variant="secondary"
              className="w-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 font-bold border-white/30"
              disabled
            >
              Starts Soon
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveSessionBanner;
