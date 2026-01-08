import { useState } from "react";
import Button from "../../../shared/components/Button";
import ExamQuestionForm from "./ExamQuestionForm";
import { FaTrash, FaPlus, FaClock } from "react-icons/fa";

const ExamCard = ({
  exam,
  onDelete,
  isAddingQ,
  onAddQuestionSubmit,
  handleRemoveQuestion,
}) => {
  const [isAddingQuestionLocal, setIsAddingQuestionLocal] = useState(false);

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-bold text-text-main">{exam.title}</h4>
          <p className="text-text-muted text-sm">{exam.description}</p>
          <div className="flex gap-4 mt-2 text-sm text-text-muted">
            <span className="flex items-center gap-1">
              <FaClock className="text-warning" /> {exam.duration} mins
            </span>
            <span className="flex items-center gap-1">
              Start: {new Date(exam.startDate).toLocaleString()}
            </span>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <FaTrash className="text-error" />
        </Button>
      </div>

      <div className="space-y-2 mt-4 border-t border-border pt-4">
        <h5 className="font-bold text-sm text-text-muted uppercase tracking-wider">
          Questions
        </h5>
        {exam.questions?.map((q, i) => (
          <div
            key={q._id || i}
            className="p-3 bg-background/50 rounded-lg border border-border flex justify-between items-center group hover:border-primary/30 transition-colors"
          >
            <div>
              <p className="font-medium text-text-main text-sm">
                <span className="font-bold text-primary mr-2">Q{i + 1}</span>
                {q.question}
              </p>
              <p className="text-xs text-text-muted mt-1">
                {q.type} • {q.points} pts
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveQuestion(q._id)}
            >
              <FaTrash size={12} className="text-error" />
            </Button>
          </div>
        ))}
        {exam.questions?.length === 0 && (
          <p className="text-sm text-text-muted italic">
            No questions added yet.
          </p>
        )}

        {isAddingQuestionLocal ? (
          <div className="mt-4">
            <ExamQuestionForm
              onSubmit={(data) => {
                onAddQuestionSubmit(data);
                setIsAddingQuestionLocal(false);
              }}
              onCancel={() => setIsAddingQuestionLocal(false)}
              isLoading={isAddingQ}
            />
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="mt-2 text-sm border-dashed"
            onClick={() => setIsAddingQuestionLocal(true)}
          >
            <FaPlus size={10} className="mr-1" /> Add Question
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExamCard;
