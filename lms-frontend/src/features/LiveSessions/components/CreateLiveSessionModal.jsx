import { useForm } from "react-hook-form";
import { FaTimes, FaVideo, FaCalendarAlt, FaToggleOn } from "react-icons/fa";
import Button from "../../../shared/components/Button";
import { useCreateSession } from "../../../hooks/useLiveSessions";
import InputError from "../../../shared/components/InputError";

const CreateLiveSessionModal = ({ isOpen, onClose, courseId }) => {
  const createSessionMutation = useCreateSession();
  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      type: "immediate",
      // Removed title and description to adhere to API contract
      startsAt: new Date().toISOString().slice(0, 16),
      recordingEnabled: false,
    },
  });

  const sessionType = watch("type");

  const onSubmit = async (data) => {
    try {
      const payload = {
        courseId,
        recordingEnabled: data.recordingEnabled,
        // If immediate, use current time. If scheduled, use selected time.
        // API requires ISO 8601 string.
        startsAt:
          data.type === "immediate"
            ? new Date().toISOString()
            : new Date(data.startsAt).toISOString(),
        ...(data.type === "immediate" && { status: "live" }),
      };

      await createSessionMutation.mutateAsync(payload);
      reset();
      onClose();
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-xl rounded-2xl border border-border overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-border flex items-center justify-between bg-primary/5">
          <div className="flex items-center gap-3 text-primary">
            <FaVideo size={24} />
            <h2 className="text-2xl font-bold">Create Live Session</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-full transition-colors text-text-muted"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="flex gap-4 p-1 bg-background rounded-xl border border-border">
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                value="immediate"
                {...register("type")}
                className="sr-only"
              />
              <div
                className={`text-center py-2 rounded-lg transition-all ${
                  sessionType === "immediate"
                    ? "bg-primary text-white font-bold"
                    : "text-text-muted hover:bg-surface"
                }`}
              >
                Immediate
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                value="scheduled"
                {...register("type")}
                className="sr-only"
              />
              <div
                className={`text-center py-2 rounded-lg transition-all ${
                  sessionType === "scheduled"
                    ? "bg-primary text-white font-bold"
                    : "text-text-muted hover:bg-surface"
                }`}
              >
                Scheduled
              </div>
            </label>
          </div>

          <div className="space-y-4">
            <p className="text-sm bg-blue-500/10 text-blue-500 p-4 rounded-xl">
              {sessionType === "immediate"
                ? "This will create a live session room that students can join immediately."
                : "This will schedule a session for a future date. Students will see it in their upcoming sessions."}
            </p>

            {sessionType === "scheduled" && (
              <div>
                <label className="text-sm font-bold text-text-main mb-2 flex items-center gap-2">
                  <FaCalendarAlt className="text-primary" /> Start At
                </label>
                <input
                  type="datetime-local"
                  {...register("startsAt", {
                    required: sessionType === "scheduled",
                  })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-background border border-border rounded-xl">
              <div className="flex items-center gap-3">
                <FaToggleOn
                  className={
                    watch("recordingEnabled")
                      ? "text-primary"
                      : "text-text-muted"
                  }
                  size={24}
                />
                <div>
                  <p className="font-bold text-text-main">Enable Recording</p>
                  <p className="text-xs text-text-muted">
                    Save the session for later viewing
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                {...register("recordingEnabled")}
                className="w-6 h-6 accent-primary"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              type="submit"
              isLoading={createSessionMutation.isPending}
            >
              {sessionType === "immediate" ? "Launch Now" : "Schedule Session"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLiveSessionModal;
