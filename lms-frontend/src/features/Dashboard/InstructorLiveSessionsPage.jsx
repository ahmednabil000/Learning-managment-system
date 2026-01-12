import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaVideo,
  FaClock,
  FaCalendarAlt,
  FaTrash,
  FaEye,
  FaPlus,
  FaEdit,
  FaExchangeAlt,
} from "react-icons/fa";
import {
  useInstructorSessions,
  useDeleteSession,
} from "../../hooks/useLiveSessions";
import useAuthStore from "../../Stores/authStore";
import Button from "../../shared/components/Button";
import ConfirmModal from "../../shared/components/ConfirmModal";
import SelectCourseModal from "../LiveSessions/components/SelectCourseModal";
import CreateLiveSessionModal from "../LiveSessions/components/CreateLiveSessionModal";
import EditLiveSessionModal from "../LiveSessions/components/EditLiveSessionModal";
import StatusUpdateModal from "../LiveSessions/components/StatusUpdateModal";
import { formatDistanceToNow } from "date-fns";

const InstructorLiveSessionsPage = () => {
  const { user } = useAuthStore();
  const { data: sessions = [], isLoading } = useInstructorSessions(user?.id);
  const deleteSessionMutation = useDeleteSession();
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [sessionToEdit, setSessionToEdit] = useState(null);
  const [sessionToUpdateStatus, setSessionToUpdateStatus] = useState(null);
  const [showCourseSelector, setShowCourseSelector] = useState(false);
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleDeleteSession = async () => {
    if (!sessionToDelete) return;

    try {
      // API expects sessionName (roomName), not ID
      await deleteSessionMutation.mutateAsync(sessionToDelete.roomName);
      setSessionToDelete(null);
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setShowCourseSelector(false);
    setShowCreateSession(true);
  };

  const handleCreateSessionClose = () => {
    setShowCreateSession(false);
    setSelectedCourse(null);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      live: "bg-red-500 text-white animate-pulse",
      scheduled: "bg-blue-500 text-white",
      ended: "bg-gray-500 text-white",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold ${
          statusColors[status] || "bg-gray-500"
        }`}
      >
        {status?.toUpperCase() || "UNKNOWN"}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-main">
            My Live Sessions
          </h1>
          <p className="text-text-muted mt-2">
            Create and manage live video sessions for your courses
          </p>
        </div>
        <Button
          onClick={() => setShowCourseSelector(true)}
          variant="primary"
          className="flex items-center gap-2"
        >
          <FaPlus /> Create Live Session
        </Button>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl p-12 text-center">
          <FaVideo className="mx-auto text-text-muted mb-4" size={48} />
          <h3 className="text-xl font-bold text-text-main mb-2">
            No Live Sessions Yet
          </h3>
          <p className="text-text-muted mb-6">
            Create your first live session to connect with your students in
            real-time.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {sessions.map((session) => {
            const scheduledDate = new Date(session.startsAt);
            const isUpcoming =
              scheduledDate > new Date() && session.status === "scheduled";

            return (
              <div
                key={session._id}
                className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getStatusBadge(session.status)}
                      <FaVideo className="text-primary" />
                      <span className="text-xs text-text-muted font-mono bg-background px-2 py-1 rounded">
                        {session.roomName}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-text-main mb-1">
                      {session.title || session.roomName}
                    </h3>

                    {session.description && (
                      <p className="text-text-muted mb-3 line-clamp-2 text-sm">
                        {session.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mb-4">
                      {session.course && (
                        <Link
                          to={`/courses/${
                            session.course._id || session.course
                          }`}
                          className="text-primary hover:underline font-semibold"
                        >
                          📚 {session.course.title || "Course"}
                        </Link>
                      )}

                      <div className="flex items-center gap-2">
                        <FaCalendarAlt />
                        <span>{scheduledDate.toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaClock />
                        <span>{session.duration} min</span>
                      </div>

                      {isUpcoming && (
                        <span className="text-blue-600 font-medium">
                          Starts{" "}
                          {formatDistanceToNow(scheduledDate, {
                            addSuffix: true,
                          })}
                        </span>
                      )}

                      {session.participants && (
                        <span>
                          👥 {session.participants.length} participants
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <Link to={`/live-session/${session.roomName}`}>
                      <Button
                        variant={
                          session.status === "scheduled" ? "primary" : "primary"
                        }
                        size="sm"
                        className="flex items-center gap-2 animate-pulse"
                      >
                        <FaVideo />{" "}
                        {session.status === "scheduled"
                          ? "Start Session"
                          : "Join Live"}
                      </Button>
                    </Link>
                    {session.status === "scheduled" && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSessionToEdit(session)}
                        className="flex items-center gap-2"
                      >
                        <FaEdit /> Edit
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSessionToDelete(session)}
                      className="flex items-center gap-2 text-red-500 hover:bg-red-50"
                    >
                      <FaTrash /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!sessionToDelete}
        onClose={() => setSessionToDelete(null)}
        onConfirm={handleDeleteSession}
        title="Delete Live Session"
        message={`Are you sure you want to delete "${
          sessionToDelete?.title || sessionToDelete?.roomName
        }"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Course Selector Modal */}
      <SelectCourseModal
        isOpen={showCourseSelector}
        onClose={() => setShowCourseSelector(false)}
        onSelectCourse={handleCourseSelect}
      />

      {/* Create Session Modal */}
      {selectedCourse && (
        <CreateLiveSessionModal
          isOpen={showCreateSession}
          onClose={handleCreateSessionClose}
          courseId={selectedCourse._id}
        />
      )}

      {/* Edit Session Modal */}
      <EditLiveSessionModal
        isOpen={!!sessionToEdit}
        onClose={() => setSessionToEdit(null)}
        session={sessionToEdit}
      />

      {/* Status Update Modal */}
      <StatusUpdateModal
        isOpen={!!sessionToUpdateStatus}
        onClose={() => setSessionToUpdateStatus(null)}
        session={sessionToUpdateStatus}
      />
    </div>
  );
};

export default InstructorLiveSessionsPage;
