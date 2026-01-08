import { useForm } from "react-hook-form";
import Button from "../../../shared/components/Button";

const formatDateForInput = (isoDate) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

const ExamForm = ({ initialData = {}, onSubmit, onCancel, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      duration: 60,
      startDate: formatDateForInput(initialData.startDate) || "",
      ...initialData,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-surface border border-border rounded-xl p-6 space-y-4 shadow-sm"
    >
      <h3 className="text-lg font-bold text-text-main">
        {initialData._id ? "Edit Exam" : "Create Exam"}
      </h3>
      <div>
        <label className="block text-sm font-bold text-text-main mb-1">
          Exam Title
        </label>
        <input
          {...register("title", { required: "Title is required" })}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
          placeholder="e.g. Midterm Exam"
        />
        {errors.title && (
          <p className="text-error text-xs mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-bold text-text-main mb-1">
          Description
        </label>
        <textarea
          {...register("description")}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
          rows={3}
          placeholder="Exam instructions..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-text-main mb-1">
            Start Date
          </label>
          <input
            type="datetime-local"
            {...register("startDate", { required: "Start Date is required" })}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
          />
          {errors.startDate && (
            <p className="text-error text-xs mt-1">
              {errors.startDate.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-bold text-text-main mb-1">
            Duration (minutes)
          </label>
          <input
            type="number"
            {...register("duration", { required: true, min: 1 })}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData._id ? "Update Exam" : "Create Exam"}
        </Button>
      </div>
    </form>
  );
};
export default ExamForm;
