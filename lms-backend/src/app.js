require("dotenv").config();
require("./config/passport");

const express = require("express");
const passport = require("passport");

const app = express();

app.use(passport.initialize());

app.use("/auth", require("./routes/authRoutes"));

app.use((req, res, next) => {
  res.send("<h1>HELLO STArT NOW</h1>");
});

app.listen(process.env.PORT);
