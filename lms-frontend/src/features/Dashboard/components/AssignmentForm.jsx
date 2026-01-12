import { useForm } from "react-hook-form";
import Button from "../../../shared/components/Button";

const AssignmentForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      ...initialData,
      ...initialData,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-surface border border-border rounded-xl p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div>
        <label className="block text-sm font-bold text-text-main mb-1">
          Assignment Title
        </label>
        <input
          {...register("title", {
            required: "Title is required",
            minLength: {
              value: 3,
              message: "Title must be at least 3 characters",
            },
          })}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
          placeholder="e.g. React Components Quiz"
        />
        {errors.title && (
          <p className="text-error text-xs mt-1">{errors.title.message}</p>
        )}
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
        <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
          Save Assignment
        </Button>
      </div>
    </form>
  );
};

export default AssignmentForm;
