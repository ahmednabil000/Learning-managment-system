import { useForm } from "react-hook-form";
import { FaSave, FaTimes } from "react-icons/fa";
import Button from "../../../shared/components/Button";

const LectureForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      title: "",
      description: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-surface border border-border rounded-xl p-6 space-y-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-text-main">
          {initialData ? "Edit Lecture" : "Add New Lecture"}
        </h4>
        <button
          type="button"
          onClick={onCancel}
          className="text-text-muted hover:text-error transition-colors"
        >
          <FaTimes />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
            Lecture Title
          </label>
          <input
            {...register("title", { required: "Title is required" })}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
            placeholder="e.g. Introduction to React"
          />
          {errors.title && (
            <p className="text-error text-[10px] mt-1 font-medium">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
            Description
          </label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm min-h-[80px]"
            placeholder="What will students learn in this lecture?"
          />
          {errors.description && (
            <p className="text-error text-[10px] mt-1 font-medium">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <FaSave /> {isLoading ? "Saving..." : "Save Lecture"}
        </Button>
      </div>
    </form>
  );
};

export default LectureForm;
