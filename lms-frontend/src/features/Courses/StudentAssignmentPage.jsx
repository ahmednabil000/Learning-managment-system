import { useParams, Link } from "react-router-dom";
import { useAssignment } from "../../hooks/useAssignments";
import { FaArrowLeft, FaExclamationCircle } from "react-icons/fa";
import Button from "../../shared/components/Button";
import ConfirmModal from "../../shared/components/ConfirmModal";
import { useState } from "react";

const StudentAssignmentPage = () => {
  const { courseId, assignmentId } = useParams();
  const { data: assignment, isLoading, isError } = useAssignment(assignmentId);
  const [answers, setAnswers] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !assignment) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <FaExclamationCircle className="text-error text-4xl mb-4" />
        <h2 className="heading-l text-error mb-4">Assignment not found</h2>
        <Link to={`/courses/${courseId}`}>
          <Button variant="primary">Back to Course</Button>
        </Link>
      </div>
    );
  }

  const handleAnswerChange = (questionId, value) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    let calculatedScore = 0;
    if (assignment.questions) {
      assignment.questions.forEach((q) => {
        if (answers[q._id] === q.correctAnswer) {
          calculatedScore += q.points;
        }
      });
    }
    setScore(calculatedScore);
    setIsSubmitted(true);
    setShowConfirmModal(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getOptionStyle = (question, option) => {
    if (!isSubmitted) return "border-border hover:bg-background cursor-pointer";

    const isSelected = answers[question._id] === option;
    const isCorrect = question.correctAnswer === option;

    if (isCorrect) return "border-success bg-success/5";
    if (isSelected && !isCorrect) return "border-error bg-error/5";

    return "border-border opacity-60 cursor-not-allowed";
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-surface border-b border-border shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link
            to={`/courses/${courseId}`}
            className="text-text-muted hover:text-primary transition-colors"
          >
            <FaArrowLeft />
          </Link>
          <h1 className="text-xl font-bold text-text-main truncate">
            {assignment.title}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Assignment Header */}
        <div className="bg-surface rounded-2xl p-8 border border-border shadow-sm">
          <h2 className="text-2xl font-bold text-primary mb-4">
            {assignment.title}
          </h2>
          <div className="flex flex-wrap gap-6 text-sm text-text-muted border-t border-border pt-6">
            <div>
              <span className="font-bold block text-text-main mb-1">
                Total Points
              </span>
              {assignment.totalPoints}
            </div>
            {isSubmitted && (
              <div className="animate-in fade-in zoom-in duration-500">
                <span className="font-bold block text-text-main mb-1">
                  Your Score
                </span>
                <span
                  className={`text-xl font-bold ${
                    score === assignment.totalPoints
                      ? "text-success"
                      : "text-primary"
                  }`}
                >
                  {score} / {assignment.totalPoints}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Questions */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {assignment.questions && assignment.questions.length > 0 ? (
            assignment.questions.map((question, index) => (
              <div
                key={question._id}
                className={`bg-surface rounded-2xl p-6 border transition-colors ${
                  isSubmitted
                    ? answers[question._id] === question.correctAnswer
                      ? "border-success/50"
                      : "border-error/50"
                    : "border-border"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-text-main text-lg flex gap-3">
                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0">
                      {index + 1}
                    </span>
                    {question.title}
                  </h3>
                  <span className="text-sm font-medium bg-background px-3 py-1 rounded-full border border-border">
                    {question.points} pts
                  </span>
                </div>

                <div className="pl-11">
                  {question.type === "multiple-choice" && (
                    <div className="space-y-3">
                      {question.options.map((option, optIdx) => (
                        <label
                          key={optIdx}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${getOptionStyle(
                            question,
                            option
                          )}`}
                        >
                          <input
                            type="radio"
                            name={`question-${question._id}`}
                            value={option}
                            disabled={isSubmitted}
                            checked={answers[question._id] === option}
                            className="w-5 h-5 text-primary focus:ring-primary disabled:opacity-50"
                            onChange={(e) =>
                              handleAnswerChange(question._id, e.target.value)
                            }
                          />
                          <span className="text-text-main">{option}</span>
                          {isSubmitted && (
                            <span className="ml-auto text-sm font-medium">
                              {question.correctAnswer === option && (
                                <span className="text-success">
                                  Correct Answer
                                </span>
                              )}
                              {answers[question._id] === option &&
                                question.correctAnswer !== option && (
                                  <span className="text-error">
                                    Your Answer
                                  </span>
                                )}
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === "true-false" && (
                    <div className="space-y-3">
                      {["True", "False"].map((option) => (
                        <label
                          key={option}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${getOptionStyle(
                            question,
                            option
                          )}`}
                        >
                          <input
                            type="radio"
                            name={`question-${question._id}`}
                            value={option}
                            disabled={isSubmitted}
                            checked={answers[question._id] === option}
                            className="w-5 h-5 text-primary focus:ring-primary disabled:opacity-50"
                            onChange={(e) =>
                              handleAnswerChange(question._id, e.target.value)
                            }
                          />
                          <span className="text-text-main">{option}</span>
                          {isSubmitted && (
                            <span className="ml-auto text-sm font-medium">
                              {question.correctAnswer === option && (
                                <span className="text-success">
                                  Correct Answer
                                </span>
                              )}
                              {answers[question._id] === option &&
                                question.correctAnswer !== option && (
                                  <span className="text-error">
                                    Your Answer
                                  </span>
                                )}
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === "essay" && (
                    <div className="space-y-2">
                      <textarea
                        className="w-full bg-background border border-border rounded-xl p-4 focus:ring-2 focus:ring-primary/50 min-h-[150px] disabled:opacity-70"
                        placeholder="Type your answer here..."
                        disabled={isSubmitted}
                        value={answers[question._id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(question._id, e.target.value)
                        }
                      />
                      {isSubmitted && (
                        <div className="p-3 bg-warning/10 text-warning rounded-lg text-sm">
                          Essay questions require manual grading.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-surface rounded-2xl border border-border border-dashed">
              <p className="text-text-muted">
                No questions available for this assignment yet.
              </p>
            </div>
          )}

          {assignment.questions &&
            assignment.questions.length > 0 &&
            !isSubmitted && (
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  className="px-12"
                >
                  Submit Assignment
                </Button>
              </div>
            )}
        </form>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Submit Assignment"
        message="Are you sure you want to submit your assignment? You won't be able to change your answers after submission."
        confirmText="Yes, Submit"
        cancelText="Cancel"
        variant="primary"
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
};

export default StudentAssignmentPage;
