import { useForm, useFieldArray } from "react-hook-form";
import { FaPlus, FaTrash } from "react-icons/fa";
import Button from "../../../shared/components/Button";

const ExamQuestionForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      question: "",
      type: "multiple-choice",
      points: 1,
      options: ["", "", "", ""],
      correctAnswer: "",
      ...initialData,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const questionType = watch("type");

  const handleFormSubmit = (data) => {
    let payload = { ...data };
    if (data.type === "true-false") {
      payload.options = ["True", "False"];
    } else if (data.type === "essay") {
      payload.options = [];
      payload.correctAnswer = "";
    }
    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="bg-surface border border-border rounded-xl p-4 space-y-4 shadow-sm"
    >
      <div>
        <label className="block text-sm font-bold text-text-main mb-1">
          Question Text
        </label>
        <input
          {...register("question", { required: "Question text is required" })}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
          placeholder="e.g. What is the value of Pi?"
        />
        {errors.question && (
          <p className="text-error text-xs mt-1">{errors.question.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-text-main mb-1">
            Type
          </label>
          <select
            {...register("type")}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True / False</option>
            {/* option value="essay">Essay</option> - If supported by backend */}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-text-main mb-1">
            Points
          </label>
          <input
            type="number"
            {...register("points", { required: "Points are required", min: 1 })}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {questionType === "multiple-choice" && (
        <div className="space-y-2">
          <label className="block text-sm font-bold text-text-main">
            Options
          </label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <input
                {...register(`options.${index}`, { required: true })}
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                placeholder={`Option ${index + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                className="text-error"
                onClick={() => remove(index)}
                disabled={fields.length <= 2}
              >
                <FaTrash size={14} />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append("")}
            className="mt-2"
          >
            <FaPlus size={12} className="mr-1" /> Add Option
          </Button>

          <div className="mt-4">
            <label className="block text-sm font-bold text-text-main mb-1">
              Correct Answer (Must match an option exactly)
            </label>
            <input
              {...register("correctAnswer", {
                required: "Correct answer is required",
              })}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
              placeholder="Copy the correct option text here"
            />
          </div>
        </div>
      )}

      {questionType === "true-false" && (
        <div className="mt-4">
          <label className="block text-sm font-bold text-text-main mb-1">
            Correct Answer
          </label>
          <select
            {...register("correctAnswer", { required: true })}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
          >
            <option value="True">True</option>
            <option value="False">False</option>
          </select>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2 border-t border-border mt-4">
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
          Save Question
        </Button>
      </div>
    </form>
  );
};

export default ExamQuestionForm;
