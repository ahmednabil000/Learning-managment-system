require("dotenv").config();
const express = require("express");

const app = express();

app.use((req, res, next) => {
  console.log("recived");
  res.send("<h1>hello</h1>");
  next();
});

app.listen(process.env.PORT);
