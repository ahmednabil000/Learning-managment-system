import { useForm } from "react-hook-form";
import { FaTimes, FaVideo, FaCalendarAlt, FaToggleOn } from "react-icons/fa";
import Button from "../../../shared/components/Button";
import { useCreateSession } from "../../../hooks/useLiveSessions";
import InputError from "../../../shared/components/InputError";

const CreateLiveSessionModal = ({ isOpen, onClose, courseId }) => {
  const createSessionMutation = useCreateSession();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "immediate",
      title: "",
      description: "",
      duration: 60,
      startsAt: new Date().toISOString().slice(0, 16),
      recordingEnabled: false,
    },
  });

  const sessionType = watch("type");

  const onSubmit = async (data) => {
    try {
      const payload = {
        courseId,
        title: data.title,
        description: data.description,
        duration: data.duration,
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-6 max-h-[80vh] overflow-y-auto"
        >
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

            <div>
              <label className="text-sm font-bold text-text-main mb-2 block">
                Session Title *
              </label>
              <input
                {...register("title", { required: "Title is required" })}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                placeholder="e.g., Weekly Q&A Session"
              />
              <InputError message={errors.title?.message} />
              {createSessionMutation.isError && (
                <InputError
                  message={
                    createSessionMutation.error?.response?.data?.message ||
                    "Failed to create session"
                  }
                />
              )}
            </div>

            <div>
              <label className="text-sm font-bold text-text-main mb-2 block">
                Description
              </label>
              <textarea
                {...register("description")}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none min-h-[100px]"
                placeholder="What will this session cover?"
              />
              <InputError message={errors.description?.message} />
            </div>

            <div>
              <label className="text-sm font-bold text-text-main mb-2 block">
                Duration (minutes)
              </label>
              <select
                {...register("duration", { min: 1 })}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes (1 hour)</option>
                <option value="90">90 minutes (1.5 hours)</option>
                <option value="120">120 minutes (2 hours)</option>
                <option value="180">180 minutes (3 hours)</option>
              </select>
            </div>

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
                <InputError message={errors.startsAt?.message} />
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
