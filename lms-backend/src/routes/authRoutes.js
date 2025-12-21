const express = require("express");
const passport = require("passport");
const generateToken = require("../utils/generateToken");

const router = express.Router();

// Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/auth/login`,
    session: false,
  }),
  (req, res) => {
    const token = generateToken(req.user);

    // Option 1: redirect with token
    res.redirect(`${process.env.CLIENT_SUCCESS_URL}?token=${token}`);

    // Option 2: send JSON
    // res.json({ token });
  }
);

module.exports = router;
