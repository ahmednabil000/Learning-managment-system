require("dotenv").config();
require("./config/passport");

const express = require("express");
const passport = require("passport");
const mongoose =require("mongoose");
const { Student  } = require("./models/index");
const app = express();

app.use(passport.initialize());

app.use("/auth", require("./routes/authRoutes"));

// Course.create({
//   title: "Course 1",
//   description: "Description 1",
//   price: 100,
//   instructor: "6583a2b2b2b2b2b2b2b2b2b2",
// }).then((course) => {
//   console.log(course);
// }).catch((error) => {
//   console.error("Error creating course:", error);
// });




app.use((req, res, next) => {
  res.send("<h1>HELLO STArT NOW</h1>");
});

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});



app.listen(process.env.PORT);

