require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Course = require("../models/courses/course");
const UserEnroll = require("../models/UserEnroll");
const logger = require("../config/logger");
const CourseSale = require("../models/courses/courseSale");

const Track = require("../models/courses/track");

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
        courseSale
          ? course.price - (course.price * courseSale.discount) / 100
          : course.price
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

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    logger.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

router.post(
  "/create-track-payment-intent",
  authMiddleware,
  async (req, res) => {
    logger.info("Creating track payment intent");
    try {
      const { trackId } = req.body;
      if (!trackId) {
        return res.status(400).json({ error: "Invalid track ID" });
      }
      const track = await Track.findById(trackId).populate("courses");
      if (!track) {
        return res.status(404).json({ error: "Track not found" });
      }

      // Calculate total price with discount
      let totalPrice = 0;
      for (const course of track.courses) {
        const isEnroll = await UserEnroll.findOne({
          user: req.user.id,
          course: course._id,
        });
        if (!isEnroll) {
          totalPrice += course.price;
        }
      }
      if (track.discount) {
        totalPrice = totalPrice - (totalPrice * track.discount) / 100;
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalPrice * 100),
        currency: "usd",
        metadata: {
          trackId,
          userId: req.user.id,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      logger.info("Track payment intent created successfully");
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      logger.error("Error creating track payment intent:", error);
      res.status(500).json({ error: "Failed to create track payment intent" });
    }
  }
);

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
    await UserEnroll.create({
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

router.post("/success-track-payment", authMiddleware, async (req, res) => {
  try {
    logger.info("Enrolling user in track courses");
    const { trackId } = req.body;
    if (!trackId) {
      return res.status(400).json({ error: "Invalid track ID" });
    }
    const track = await Track.findById(trackId);
    if (!track) {
      return res.status(404).json({ error: "Track not found" });
    }

    const enrollmentPromises = track.courses.map(async (courseId) => {
      const exists = await UserEnroll.findOne({
        user: req.user.id,
        course: courseId,
      });
      if (!exists) {
        return UserEnroll.create({
          user: req.user.id,
          course: courseId,
          enrolledAt: new Date(),
        });
      }
    });

    await Promise.all(enrollmentPromises);

    logger.info("User enrolled in track courses successfully");
    res.json({ message: "User enrolled in track courses successfully" });
  } catch (error) {
    logger.error("Error enrolling user in track:", error);
    res.status(500).json({ error: "Failed to enroll user in track" });
  }
});

module.exports = router;
