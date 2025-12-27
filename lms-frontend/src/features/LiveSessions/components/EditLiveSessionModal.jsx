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
            Updating schedule for:{" "}
            <span className="font-bold text-text-main">
              {session.roomName || session.course?.title || "Session"}
            </span>
          </p>

          <div>
            <label className="block text-sm font-bold text-text-main mb-2">
              Start At
            </label>
            <input
              type="datetime-local"
              {...register("startsAt", { required: "Start time is required" })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
            />
            <InputError error={errors.startsAt} />
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
