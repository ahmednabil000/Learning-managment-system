import { useForm } from "react-hook-form";
import { FaTimes, FaEdit } from "react-icons/fa";
import Button from "../../../shared/components/Button";
import InputError from "../../../shared/components/InputError";
import { useEffect } from "react";
import { useUpdateSession } from "../../../hooks/useLiveSessions";

const EditLiveSessionModal = ({ isOpen, onClose, session }) => {
  const updateSessionMutation = useUpdateSession();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (session) {
      reset({
        title: session.title,
        description: session.description,
        duration: session.duration,
        startsAt: session.startsAt
          ? new Date(session.startsAt).toISOString().slice(0, 16)
          : "",
      });
    }
  }, [session, reset]);

  const onSubmit = (data) => {
    updateSessionMutation.mutate(
      {
        id: session._id,
        data: {
          title: data.title,
          description: data.description,
          duration: data.duration,
          startsAt: new Date(data.startsAt).toISOString(),
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  if (!isOpen || !session) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-md rounded-2xl border border-border overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3 text-info">
            <FaEdit size={20} />
            <h2 className="text-xl font-bold">Edit Session</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-full transition-colors text-text-muted"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <p className="text-sm text-text-muted">
            Updating:{" "}
            <span className="font-bold text-text-main">
              {session.title || session.roomName || "Session"}
            </span>
          </p>

          <div>
            <label className="block text-sm font-bold text-text-main mb-2">
              Title
            </label>
            <input
              {...register("title", { required: "Title is required" })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
            />
            <InputError message={errors.title?.message} />
          </div>

          <div>
            <label className="block text-sm font-bold text-text-main mb-2">
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none min-h-[80px]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-text-main mb-2">
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

          <div>
            <label className="block text-sm font-bold text-text-main mb-2">
              Start At
            </label>
            <input
              type="datetime-local"
              {...register("startsAt", { required: "Start time is required" })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
            />
            <InputError message={errors.startsAt?.message} />
          </div>

          <div className="flex gap-3 pt-4">
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
              isLoading={updateSessionMutation.isPending}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLiveSessionModal;
