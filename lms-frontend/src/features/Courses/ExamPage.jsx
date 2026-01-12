import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  useCourseAvailableExam,
  useStartAttempt,
  useSubmitAnswer,
  useEndAttempt,
  useGetAttempt,
} from "../../hooks/useExams";
import Button from "../../shared/components/Button";
import {
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaListOl,
  FaFileAlt,
  FaPlay,
  FaCheck,
  FaTimes,
  FaTrophy,
} from "react-icons/fa";
import notification from "../../utils/notification";
import ConfirmModal from "../../shared/components/ConfirmModal";

const ExamPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  // We fetch available exam because it's the one student can take.
  // Ideally, we can fetch by examId too if an endpoint existed for students.
  // We'll rely on 'available' for now or assume examId leads to the same data if we had 'getExam'.
  const { data: exam, isLoading: loadingExam } =
    useCourseAvailableExam(courseId);
  const [attemptId, setAttemptId] = useState(null);
  const [attemptData, setAttemptData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { mutate: startAttempt, isPending: starting } = useStartAttempt({
    onSuccess: (data) => {
      setAttemptId(data._id);
      setAttemptData(data);
      notification.success("Exam started! Good luck.");
    },
    onError: (err) => {
      notification.error(
        err?.response?.data?.message || "Failed to start exam"
      );
    },
  });

  const { mutate: submitAns } = useSubmitAnswer({
    onError: () => notification.error("Failed to save answer"),
  });

  const { mutate: endAttemptCmd, isPending: ending } = useEndAttempt({
    onSuccess: (data) => {
      setAttemptData(data); // Final data with score
      notification.success("Exam submitted successfully!");
    },
    onError: (err) =>
      notification.error(
        err?.response?.data?.message || "Failed to submit exam"
      ),
  });

  // If exam has userAttempt, load it
  // Check if exam has existing attempt when loaded
  useEffect(() => {
    if (exam && exam.userAttempt && !attemptId) {
      // Only set if not already set to avoid loop,
      // though 'attemptId' dependency isn't here, setting state triggers re-render.
      // It seems fine but React warns if it happens synchronously.
      // It's in useEffect, so it's not synchronous to render, but triggers update.
      // The warning 'Calling setState synchronously within an effect' usually means
      // we might be better off deriving state during render or using a ref if not for rendering.
      // However, we need attemptId to fetch fresh data.

      setAttemptId(exam.userAttempt._id);
      setAttemptData(exam.userAttempt);

      if (exam.userAttempt.answers) {
        const ansMap = {};
        exam.userAttempt.answers.forEach((a) => {
          ansMap[a.question] = a.answer;
        });
        setAnswers(ansMap);
      }
    }
  }, [exam, attemptId]);

  // Load fresh attempt details if we have ID
  // Rely on freshAttempt if available, falling back to attemptData (from mutation).
  const { data: freshAttempt } = useGetAttempt(attemptId, !!attemptId);
  const currentAttempt = freshAttempt || attemptData;

  useEffect(() => {
    if (
      currentAttempt &&
      currentAttempt.status !== "completed" &&
      timeLeft === null &&
      exam
    ) {
      // Calculate remaining time
      const start = new Date(currentAttempt.createdAt).getTime();
      const durationMs = exam.duration * 60 * 1000;
      const endInfo = start + durationMs;
      const now = Date.now();
      setTimeLeft(Math.max(0, endInfo - now));
    }
  }, [currentAttempt, timeLeft, exam]);

  // Timer Tick
  useEffect(() => {
    const isActive =
      currentAttempt &&
      (currentAttempt.status === "in-progress" ||
        currentAttempt.status === "started") &&
      timeLeft !== null;

    if (isActive) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1000) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentAttempt, attemptId, endAttemptCmd, timeLeft]);

  const handleAnswerChange = (questionId, value) => {
    const isActive =
      currentAttempt?.status === "in-progress" ||
      currentAttempt?.status === "started";
    if (!isActive) return;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    submitAns({ attemptId, data: { questionId, answer: value } });
  };

  const handleFinish = () => {
    setIsConfirmOpen(true);
  };

  const formatTime = (ms) => {
    if (ms === null) return "--:--";
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (loadingExam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-text-main">Exam Not Found</h2>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  // Not Started View
  if (!currentAttempt) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-64 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative bg-surface p-8 md:p-10 rounded-3xl shadow-2xl max-w-lg w-full text-center space-y-6 border border-border/50 backdrop-blur-sm">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <FaFileAlt size={40} />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-text-main tracking-tight">
              {exam.title}
            </h1>
            {exam.description && (
              <p className="text-text-muted text-lg leading-relaxed">
                {exam.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 py-6">
            <div className="bg-background p-4 rounded-xl border border-border flex flex-col items-center justify-center gap-1 group hover:border-primary/30 transition-colors">
              <FaClock className="text-primary text-xl mb-1 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-text-main">
                {exam.duration} Min
              </span>
              <span className="text-xs text-text-muted uppercase tracking-wider">
                Duration
              </span>
            </div>
            <div className="bg-background p-4 rounded-xl border border-border flex flex-col items-center justify-center gap-1 group hover:border-primary/30 transition-colors">
              <FaListOl className="text-primary text-xl mb-1 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-text-main">
                {exam.questions?.length || 0}
              </span>
              <span className="text-xs text-text-muted uppercase tracking-wider">
                Questions
              </span>
            </div>
          </div>

          <div className="bg-accent/5 p-5 rounded-xl text-sm text-left border border-accent/10">
            <p className="font-bold text-accent mb-3 flex items-center gap-2">
              <FaExclamationCircle /> Important Instructions:
            </p>
            <ul className="space-y-2 text-text-muted/80 list-disc list-inside">
              <li>
                Once you start, the timer <strong>cannot be paused</strong>.
              </li>
              <li>Ensure you have a stable internet connection.</li>
              <li>Do not refresh or close the page.</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() =>
                startAttempt({ examId: exam._id, data: { score: 0 } })
              }
              isLoading={starting}
              className="flex-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
            >
              <FaPlay className="mr-2 text-xs" /> Start Exam
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Result View
  if (
    currentAttempt.status === "completed" ||
    currentAttempt.status === "ended"
  ) {
    const score = currentAttempt.score || 0;
    // Calculate max score?
    const maxScore = exam.questions.reduce(
      (acc, q) => acc + (q.points || 0),
      0
    );

    return (
      <div className="min-h-screen bg-background py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Score Card */}
          <div className="bg-surface rounded-3xl shadow-xl overflow-hidden border border-border">
            <div className="bg-primary/5 p-8 text-center border-b border-border">
              <div className="inline-flex items-center justify-center p-4 bg-background rounded-full mb-4 shadow-sm text-warning">
                <FaTrophy size={48} className="drop-shadow-sm" />
              </div>
              <h1 className="text-3xl font-black text-text-main mb-2">
                Exam Completed!
              </h1>
              <p className="text-text-muted">
                You have successfully entered your submission.
              </p>
            </div>

            <div className="p-8 text-center bg-background/50">
              <p className="text-sm font-bold text-text-muted uppercase tracking-widest mb-2">
                Total Score
              </p>
              <div className="flex items-baseline justify-center gap-1 text-primary">
                <span className="text-6xl font-black">{score}</span>
                <span className="text-2xl font-medium text-text-muted">
                  / {maxScore}
                </span>
              </div>
            </div>

            <div className="p-4 bg-background border-t border-border flex justify-between">
              <Button
                variant="ghost"
                onClick={() => navigate(`/courses/${courseId}`)}
              >
                Back to Course
              </Button>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-text-main px-2">
              Detailed Analysis
            </h2>
            {exam.questions.map((q, index) => {
              const userAnswerObj = currentAttempt.answers.find(
                (a) => a.question === q._id || a.question?._id === q._id
              );
              const userAnswer = userAnswerObj?.answer;
              const isCorrect = userAnswer === q.correctAnswer;
              const isSkipped = !userAnswer;

              return (
                <div
                  key={q._id}
                  className={`bg-surface rounded-xl border-l-4 p-6 shadow-xs ${
                    isCorrect
                      ? "border-l-success border-border"
                      : "border-l-error border-border"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                          isCorrect
                            ? "bg-success/10 text-success"
                            : "bg-error/10 text-error"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="font-bold text-lg text-text-main">
                          {q.question}
                        </h3>
                        <span className="text-xs font-semibold text-text-muted">
                          {q.points} Points
                        </span>
                      </div>
                    </div>
                    {isCorrect ? (
                      <FaCheckCircle className="text-success text-xl" />
                    ) : (
                      <FaTimes className="text-error text-xl" />
                    )}
                  </div>

                  <div className="pl-12 space-y-3">
                    <div
                      className={`p-4 rounded-lg border ${
                        isCorrect
                          ? "bg-success/5 border-success/20"
                          : "bg-error/5 border-error/20"
                      }`}
                    >
                      <p className="text-xs font-bold uppercase mb-1 opacity-70">
                        Your Answer
                      </p>
                      <p
                        className={`font-medium ${
                          isCorrect ? "text-success-dark" : "text-error-dark"
                        }`}
                      >
                        {userAnswer || (
                          <span className="italic text-text-muted">
                            Skipped
                          </span>
                        )}
                      </p>
                    </div>

                    {!isCorrect && q.correctAnswer && (
                      <div className="p-4 rounded-lg border border-success/20 bg-success/5">
                        <p className="text-xs font-bold uppercase mb-1 text-success opacity-70">
                          Correct Answer
                        </p>
                        <p className="font-medium text-success-dark flex items-center gap-2">
                          <FaCheck size={12} /> {q.correctAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center pt-8">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(`/courses/${courseId}`)}
              className="px-12"
            >
              Return to Course Board
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Active Exam View
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-surface border-b border-border z-50 shadow-sm h-16 flex items-center justify-between px-4 lg:px-8">
        <h2 className="font-bold text-lg text-text-main truncate max-w-md">
          {exam.title}
        </h2>
        <div
          className={`flex items-center gap-2 font-mono font-bold text-xl px-4 py-1 rounded bg-background border ${
            timeLeft < 60000
              ? "text-error border-error"
              : "text-primary border-primary"
          }`}
        >
          <FaClock />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="max-w-3xl mx-auto pt-24 px-4 space-y-6">
        {/* Exam Params Header */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs">
          <h1 className="text-2xl md:text-3xl font-black text-text-main mb-2">
            {exam.title}
          </h1>
          {exam.description && (
            <p className="text-text-muted leading-relaxed border-l-4 border-primary/20 pl-4 py-1 mb-4">
              {exam.description}
            </p>
          )}
          <div className="flex items-center gap-6 text-sm font-medium text-text-muted border-t border-border pt-4 mt-2">
            <div className="flex items-center gap-2">
              <FaClock className="text-primary" />
              <span>{exam.duration} Minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <FaListOl className="text-primary" />
              <span>{exam.questions?.length || 0} Questions</span>
            </div>
          </div>
        </div>
        {exam.questions?.map((q, index) => (
          <div
            key={q._id}
            className="bg-surface border border-border rounded-xl p-6 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-text-main flex gap-3">
                <span className="bg-primary/10 text-primary w-8 h-8 flex items-center justify-center rounded-lg text-sm shrink-0">
                  {index + 1}
                </span>
                {q.question}
              </h3>
              <span className="text-xs font-bold text-text-muted bg-background px-2 py-1 rounded border border-border shrink-0">
                {q.points} Pts
              </span>
            </div>

            <div className="space-y-3 pl-11">
              {q.type === "multiple-choice" || q.type === "true-false" ? (
                q.options.map((opt, optIndex) => (
                  <label
                    key={optIndex}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      answers[q._id] === opt
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:bg-background/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${q._id}`}
                      value={opt}
                      checked={answers[q._id] === opt}
                      onChange={() => handleAnswerChange(q._id, opt)}
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <span className="text-text-main">{opt}</span>
                  </label>
                ))
              ) : (
                <textarea
                  className="w-full bg-background border border-border rounded-lg p-3 focus:ring-2 focus:ring-primary/50 min-h-[100px]"
                  placeholder="Type your answer here..."
                  value={answers[q._id] || ""}
                  onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                />
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-8 pb-12">
          <Button
            variant="primary"
            size="lg"
            onClick={handleFinish}
            isLoading={ending}
          >
            Submit Exam
          </Button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          endAttemptCmd(attemptId);
          setIsConfirmOpen(false);
        }}
        title="Submit Exam?"
        message="Are you sure you want to submit your exam? You won't be able to change your answers afterwards."
        confirmText="Yes, Submit"
        cancelText="Cancel"
        variant="warning"
        isLoading={ending}
      />
    </div>
  );
};

export default ExamPage;
