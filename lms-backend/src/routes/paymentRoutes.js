require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Course = require("../models/courses/course");
const UserEnroll = require("../models/UserEnroll");
const logger = require("../config/logger");
const CourseSale = require("../models/courses/courseSale");

router.post("/create-payment-intent", authMiddleware, async (req, res) => {
  logger.info("Creating payment intent");
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ error: "Invalid course ID" });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    const userEnroll = await UserEnroll.findOne({
      user: req.user.id,
      course: courseId,
    });
    const courseSale = await CourseSale.findOne({
      course: courseId,
      status: "active",
    });
    if (userEnroll) {
      return res
        .status(400)
        .json({ error: "You are already enrolled in this course" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(
        courseSale ? courseSale.salePrice : course.price * 100
      ),
      currency: "usd",
      metadata: {
        courseId,
        userId: req.user.id,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });
    logger.info("Payment intent created successfully");

    logger.info("Payment intent created successfully");
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    logger.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

router.post("/success-payment", authMiddleware, async (req, res) => {
  try {
    logger.info("Enrolling user");
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ error: "Invalid course ID" });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    const userEnroll = await UserEnroll.findOne({
      user: req.user.id,
      course: courseId,
    });
    if (userEnroll) {
      return res
        .status(400)
        .json({ error: "You are already enrolled in this course" });
    }
    UserEnroll.create({
      user: req.user.id,
      course: req.body.courseId,
      enrolledAt: new Date(),
    });
    logger.info("User enrolled successfully");
    res.json({ message: "User enrolled successfully" });
  } catch (error) {
    logger.error("Error enrolling user:", error);
    res.status(500).json({ error: "Failed to enroll user" });
  }
});

module.exports = router;
