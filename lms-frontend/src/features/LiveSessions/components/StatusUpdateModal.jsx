import {
  FaTimes,
  FaExchangeAlt,
  FaCheckCircle,
  FaPlayCircle,
  FaStopCircle,
} from "react-icons/fa";
import Button from "../../../shared/components/Button";
import { useUpdateStatus } from "../../../hooks/useLiveSessions";

const StatusUpdateModal = ({ isOpen, onClose, session }) => {
  const updateStatusMutation = useUpdateStatus();

  const handleUpdateStatus = (status) => {
    updateStatusMutation.mutate(
      { id: session._id, status },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  if (!isOpen || !session) return null;

  const statuses = [
    {
      value: "scheduled",
      label: "Scheduled",
      icon: FaCheckCircle,
      color: "text-blue-500",
      bg: "hover:bg-blue-50",
    },
    {
      value: "live",
      label: "Live Now",
      icon: FaPlayCircle,
      color: "text-red-500",
      bg: "hover:bg-red-50",
    },
    {
      value: "ended",
      label: "Ended",
      icon: FaStopCircle,
      color: "text-gray-500",
      bg: "hover:bg-gray-50",
    },
  ];

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-sm rounded-2xl border border-border overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-border flex items-center justify-between bg-background">
          <div className="flex items-center gap-3 text-primary">
            <FaExchangeAlt size={18} />
            <h2 className="text-xl font-bold">Update Status</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-full transition-colors text-text-muted"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <p className="text-sm text-text-muted mb-4 text-center">
            Change current status of <br />
            <span className="font-bold text-text-main">
              {session.roomName || session.course?.title || "Session"}
            </span>
          </p>

          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => handleUpdateStatus(status.value)}
              disabled={
                session.status === status.value ||
                updateStatusMutation.isPending
              }
              className={`w-full flex items-center gap-4 p-4 rounded-xl border border-border transition-all text-left ${
                session.status === status.value
                  ? "bg-background border-primary ring-1 ring-primary"
                  : `${status.bg}`
              } ${
                updateStatusMutation.isPending
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <status.icon className={`${status.color}`} size={24} />
              <div className="flex-1">
                <p
                  className={`font-bold ${
                    session.status === status.value
                      ? "text-primary"
                      : "text-text-main"
                  }`}
                >
                  {status.label}
                </p>
                {session.status === status.value && (
                  <p className="text-[10px] text-primary uppercase font-bold tracking-wider">
                    Current Status
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 bg-background flex gap-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={onClose}
            disabled={updateStatusMutation.isPending}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;
