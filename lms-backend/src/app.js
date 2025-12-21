require("dotenv").config();
require("./config/passport");

const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

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
app.use("/exam-attempts", require("./routes/examAttemptRoutes"));
app.use("/assignment-attempts", require("./routes/assignmentAttemptRoutes"));
app.use("/course-tags", require("./routes/courseTagRoutes"));
app.use("/exams", require("./routes/examRoutes"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.listen(process.env.PORT);
