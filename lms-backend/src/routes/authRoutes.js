const express = require("express");
const passport = require("passport");
const generateToken = require("../utils/generateToken");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

// Redirect to Google
router.get("/google", (req, res, next) => {
  const state =
    req.query.state || encodeURIComponent(JSON.stringify({ callback: "/" }));

  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state: state,
  })(req, res, next);
});

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/auth/login`,
    session: false,
  }),
  (req, res) => {
    const token = generateToken(req.user);
    let callback = "/";
    try {
      callback = JSON.stringify(req.query.state);
    } catch (e) {}
    // Option 1: redirect with token
    res.redirect(
      `${process.env.CLIENT_SUCCESS_URL}?token=${token}&callback=${callback}`
    );

    // Option 2: send JSON
    // res.json({ token });
  }
);

module.exports = router;
