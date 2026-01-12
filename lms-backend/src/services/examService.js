const { Exam, ExamQuestion, ExamAttempt } = require("../models/index");
const UserEnroll = require("../models/UserEnroll");
const Course = require("../models/courses/course");

module.exports.createExam = async (userId, examData) => {
  const course = await Course.findById(examData.course);
  if (!course) {
    return {
      statusCode: 404,
      message: "Course not found",
    };
  }
  if (userId != course.instructor) {
    return {
      statusCode: 401,
      message: "You are not authorized to create an exam for this course",
    };
  }
  const existingExam = await Exam.findOne({ course: course._id });
  if (existingExam) {
    return {
      statusCode: 400,
      message: "Already there is an active exam exists for this course",
    };
  }
  const exam = new Exam({
    ...examData,
    course: course._id,
    instructor: userId,
  });
  await exam.save();
  return {
    statusCode: 201,
    message: "Exam created successfully",
    data: exam,
  };
};

module.exports.addQuestionToExam = async (userId, examId, questionData) => {
  const exam = await Exam.findById(examId);
  if (!exam) {
    return {
      statusCode: 404,
      message: "Exam not found",
    };
  }
  if (userId != exam.instructor) {
    return {
      statusCode: 401,
      message: "You are not authorized to add a question to this exam",
    };
  }
  const question = new ExamQuestion({
    ...questionData,
    exam: exam._id,
    instructor: userId,
  });
  await question.save();
  exam.questions.push(question._id);
  await exam.save();
  return {
    statusCode: 201,
    message: "Question added to exam successfully",
    data: question,
  };
};

module.exports.removeQuestionFromExam = async (userId, examId, questionId) => {
  const exam = await Exam.findById(examId);
  if (!exam) {
    return {
      statusCode: 404,
      message: "Exam not found",
    };
  }
  if (userId != exam.instructor) {
    return {
      statusCode: 401,
      message: "You are not authorized to remove a question from this exam",
    };
  }
  exam.questions.pull(questionId);
  await exam.save();
  return {
    statusCode: 200,
    message: "Question removed from exam successfully",
  };
};

module.exports.removeExam = async (userId, examId) => {
  const exam = await Exam.findById(examId);
  if (!exam) {
    return {
      statusCode: 404,
      message: "Exam not found",
    };
  }
  if (userId != exam.instructor) {
    return {
      statusCode: 401,
      message: "You are not authorized to remove this exam",
    };
  }
  await exam.deleteOne();
  return {
    statusCode: 200,
    message: "Exam removed successfully",
  };
};

module.exports.addExamAttempt = async (userId, examId, attemptData) => {
  const userAttempt = await ExamAttempt.findOne({
    user: userId,
    exam: examId,
  }).populate("exam");

  if (userAttempt) {
    return {
      statusCode: 200,
      message: "Exam attempt retrieved successfully",
      data: userAttempt,
    };
  }
  const exam = await Exam.findById(examId);
  if (!exam) {
    return {
      statusCode: 404,
      message: "Exam not found",
    };
  }
  const user = await UserEnroll.findOne({ user: userId, course: exam.course });
  if (!user) {
    return {
      statusCode: 404,
      message: "User not enrolled in this course",
    };
  }
  const attempt = new ExamAttempt({
    ...attemptData,
    exam: exam._id,
    user: userId,
  });
  await attempt.save();
  return {
    statusCode: 201,
    message: "Exam attempt added successfully",
    data: attempt,
  };
};

module.exports.addAnswerToAttempt = async (
  userId,
  examAttemptId,
  questionId,
  answer
) => {
  const attempt = await ExamAttempt.findById(examAttemptId).populate("exam");
  if (!attempt) {
    return {
      statusCode: 404,
      message: "Exam attempt not found",
    };
  }
  if (attempt.status == "ended") {
    return {
      statusCode: 400,
      message: "Exam attempt is already ended",
    };
  }
  // Check if time is up based on *attempt* start time + duration
  const startTime = new Date(attempt.createdAt).getTime();
  const durationMs = attempt.exam.duration * 60 * 1000;
  // Use a small buffer (e.g., 2 minutes) for network latency/grace period if desired
  if (startTime + durationMs + 2 * 60 * 1000 < Date.now()) {
    return {
      statusCode: 400,
      message: "Time is up for this exam",
    };
  }
  const question = await ExamQuestion.findById(questionId);
  if (!question) {
    return {
      statusCode: 404,
      message: "Question not found",
    };
  }
  if (userId != attempt.user) {
    return {
      statusCode: 401,
      message: "You are not authorized to add an answer to this exam attempt",
    };
  }

  // Use atomic updates to avoid VersionError on rapid saves
  const updateResult = await ExamAttempt.updateOne(
    { _id: examAttemptId, "answers.question": question._id },
    { $set: { "answers.$.answer": answer } }
  );

  if (updateResult.matchedCount === 0) {
    // If not matched, push new answer
    await ExamAttempt.updateOne(
      { _id: examAttemptId },
      {
        $push: {
          answers: {
            question: question._id,
            answer,
          },
        },
      }
    );
  }

  // Fetch updated attempt to return
  const updatedAttempt = await ExamAttempt.findById(examAttemptId).populate(
    "exam"
  );

  return {
    statusCode: 201,
    message: "Answer added to exam attempt successfully",
    data: updatedAttempt,
  };
};

module.exports.getExamRemainedDuration = async (userId, examId) => {
  const exam = await Exam.findById(examId);
  if (!exam) {
    return {
      statusCode: 404,
      message: "Exam not found",
    };
  }
  const user = await UserEnroll.findOne({
    user: userId,
    course: exam.course,
  });
  if (!user) {
    return {
      statusCode: 404,
      message: "User not enrolled in this course",
    };
  }
  if (exam.startDate > Date.now()) {
    return {
      statusCode: 400,
      message: "Exam has not started yet",
    };
  }
  if (exam.startDate + exam.duration * 60 * 1000 < Date.now()) {
    return {
      statusCode: 400,
      message: "Exam has ended",
    };
  }
  const availableDuration =
    exam.startDate + exam.duration * 60 * 1000 - Date.now();
  return {
    statusCode: 200,
    message: "Exam available duration",
    data: availableDuration,
  };
};

module.exports.getCourseAvailableExam = async (userId, courseId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    return {
      statusCode: 404,
      message: "Course not found",
    };
  }
  const user = await UserEnroll.findOne({
    user: userId,
    course: courseId,
  });
  if (!user) {
    return {
      statusCode: 404,
      message: "User not enrolled in this course",
    };
  }
  const exam = await Exam.findOne({
    course: courseId,
    status: { $in: ["started", "not-started"] },
  }).populate("questions");

  if (!exam) {
    return {
      statusCode: 404,
      message: "No available exam",
    };
  }

  // Check for existing attempt
  const attempt = await ExamAttempt.findOne({
    exam: exam._id,
    user: userId,
  });

  const examData = exam.toObject();
  if (attempt) {
    examData.userAttempt = attempt;
  }

  return {
    statusCode: 200,
    message: "Course available exam",
    data: examData,
  };
};

module.exports.endExamAttempt = async (attemptId, userId) => {
  const attempt = await ExamAttempt.findById(attemptId).populate({
    path: "exam",
    populate: {
      path: "questions",
    },
  });
  if (!attempt) {
    return {
      statusCode: 404,
      message: "Exam attempt not found",
    };
  }
  if (attempt.user != userId) {
    return {
      statusCode: 401,
      message: "You are not authorized to end this exam attempt",
    };
  }
  if (attempt.status == "ended") {
    const score = CalculateTotalScore(attempt);
    attempt.score = score;
    await attempt.save();
    return {
      statusCode: 200,
      message: "Exam attempt ended successfully",
      data: attempt,
    };
  }
  attempt.status = "ended";
  attempt.score = CalculateTotalScore(attempt);
  await attempt.save();
  return {
    statusCode: 200,
    message: "Exam attempt ended successfully",
    data: attempt,
  };
};

module.exports.getExamAttemptById = async (userId, attemptId) => {
  const attempt = await ExamAttempt.findById(attemptId).populate({
    path: "exam",
    populate: {
      path: "questions",
      select: "-correctAnswer",
    },
  });

  if (!attempt) {
    return {
      statusCode: 404,
      message: "Exam attempt not found",
    };
  }
  if (attempt.user != userId) {
    return {
      statusCode: 401,
      message: "You are not authorized to get this exam attempt",
    };
  }

  return {
    statusCode: 200,
    message: "Exam attempt retrieved successfully",
    data: attempt,
  };
};

function CalculateTotalScore(attempt) {
  return attempt.answers.reduce((acc, answer) => {
    const question = attempt.exam.questions.find(
      (q) => q._id.toString() === answer.question.toString()
    );
    if (question && answer.answer === question.correctAnswer) {
      return acc + question.points;
    }
    return acc;
  }, 0);
}

module.exports.getExamsByCourseId = async (userId, courseId) => {
  const exams = await Exam.find({
    course: courseId,
    instructor: userId,
  }).populate({
    path: "questions",
  });

  if (!exams) {
    return {
      statusCode: 404,
      message: "Exams not found",
    };
  }

  return {
    statusCode: 200,
    message: "Exam retrieved successfully",
    data: exams,
  };
};
