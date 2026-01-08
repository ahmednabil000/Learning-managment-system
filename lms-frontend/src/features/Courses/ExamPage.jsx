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
import { FaClock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import notification from "../../utils/notification";

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
    if (
      currentAttempt &&
      currentAttempt.status === "in-progress" &&
      timeLeft !== null
    ) {
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
    if (currentAttempt?.status !== "in-progress") return;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    submitAns({ attemptId, data: { questionId, answer: value } });
  };

  const handleFinish = () => {
    if (window.confirm("Are you sure you want to finish the exam?")) {
      endAttemptCmd(attemptId);
    }
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface p-8 rounded-2xl shadow-lg max-w-lg w-full text-center space-y-6 border border-border">
          <FaCheckCircle className="mx-auto text-primary text-5xl" />
          <h1 className="text-3xl font-bold text-text-main">{exam.title}</h1>
          <p className="text-text-muted">{exam.description}</p>
          <div className="flex justify-center gap-6 text-sm text-text-main font-bold">
            <span className="flex items-center gap-2">
              <FaClock className="text-warning" /> {exam.duration} Minutes
            </span>
            <span>{exam.questions?.length || 0} Questions</span>
          </div>
          <div className="bg-accent/10 p-4 rounded-lg text-sm text-accent text-left">
            <p className="font-bold mb-2">Instructions:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Once you start, the timer will not stop.</li>
              <li>Ensure you have a stable internet connection.</li>
              <li>Do not refresh the page frequently.</li>
            </ul>
          </div>
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={() =>
              startAttempt({ examId: exam._id, data: { score: 0 } })
            }
            isLoading={starting}
          >
            Start Exam
          </Button>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface p-8 rounded-2xl shadow-lg max-w-md w-full text-center space-y-6 border border-border">
          <FaCheckCircle className="mx-auto text-success text-6xl" />
          <h1 className="text-3xl font-bold text-text-main">Exam Completed!</h1>
          <p className="text-text-muted">
            You have successfully submitted your exam.
          </p>
          <div className="py-6 bg-background/50 rounded-xl">
            <p className="text-sm text-text-muted uppercase mb-1">Your Score</p>
            <p className="text-5xl font-black text-primary">
              {score}{" "}
              <span className="text-xl text-text-muted font-normal">
                / {maxScore}
              </span>
            </p>
          </div>
          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate(`/courses/${courseId}`)}
          >
            Return to Course
          </Button>
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

      <div className="max-w-3xl mx-auto pt-24 px-4 space-y-8">
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
    </div>
  );
};

export default ExamPage;
