const jwt = require("jsonwebtoken");

const optionalAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return next();

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    // If token is invalid, just proceed as unauthenticated
    next();
  }
};

module.exports = optionalAuthMiddleware;
