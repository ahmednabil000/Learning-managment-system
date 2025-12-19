require("dotenv").config();
require("./config/passport");

const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const { Student } = require("./models/index");
const app = express();

app.use(passport.initialize());

app.use("/auth", require("./routes/authRoutes"));
app.use("/tracks", require("./routes/tracksRoutes"));
app.use("/courses", require("./routes/courseRoutes"));

 mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.listen(process.env.PORT);
