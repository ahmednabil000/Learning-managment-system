const app = require("./app.js");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 7000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ✅ Graceful shutdown (VERY important for nodemon)
process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
