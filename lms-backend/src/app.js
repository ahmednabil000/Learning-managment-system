require("dotenv").config();
require("./config/passport");

const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const cron = require("node-cron");
const deactivateExpiredCourseSales = require("./scedualedJobs/courseSalesJobs");
const updateExamStatus = require("./scedualedJobs/exams");

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://myfrontend.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use("/auth", require("./routes/authRoutes"));
app.use("/tracks", require("./routes/tracksRoutes"));
app.use("/courses", require("./routes/courseRoutes"));
app.use("/lectures", require("./routes/lectureRoutes"));
app.use("/lessons", require("./routes/lessonRoutes"));
app.use("/assignments", require("./routes/assignmentRoutes"));
app.use("/questions", require("./routes/questionRoutes"));
app.use("/answers", require("./routes/answerRoutes"));
app.use("/course-tags", require("./routes/courseTagRoutes"));
app.use("/sessions", require("./routes/liveSessionRoutes"));
app.use("/comments", require("./routes/commentRoutes"));
app.use("/payments", require("./routes/paymentRoutes"));
app.use("/analytics/instructor", require("./routes/instructorAnalyticsRoutes"));
app.use("/course-comments", require("./routes/courseCommentRoutes"));
app.use("/course-blogs", require("./routes/courseBlogRoutes"));
app.use("/lecture-items", require("./routes/lectureItemRoutes"));
app.use("/exams", require("./routes/examRoutes"));
app.use("/instructors", require("./routes/instructorRoutes"));
// 404 handler - must be after all other routes
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.path}`,
  });
});

cron.schedule("*/1 * * * *", () => {
  deactivateExpiredCourseSales();
  updateExamStatus();
});

mongoose
  .connect(process.env.MONGO_ATLAS, { dbName: "your_atlas_db_name" })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

module.exports = app;
