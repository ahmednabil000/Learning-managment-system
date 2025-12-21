const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const baseOptions = {
  discriminatorKey: "role",
  timestamps: true,
};

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    name: String,
    email: {
      type: String,
      unique: true,
    },
    googleId: {
      type: String,
      unique: true,
    },
    imageUrl: String,
    // Role is handled by the discriminator, but we can keep the enum for validation if needed
    // or simply rely on the discriminator values.
  },
  baseOptions
);

const User = mongoose.model("User", userSchema);

// Instructor Discriminator
const instructorSchema = new mongoose.Schema({});
const Instructor = User.discriminator("Instructor", instructorSchema);

// Student Discriminator
const studentSchema = new mongoose.Schema({
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});
const Student = User.discriminator("Student", studentSchema);

const Admin = User.discriminator("Admin", new mongoose.Schema({}));
const SuperAdmin = User.discriminator("Superadmin", new mongoose.Schema({}));

module.exports = {
  User,
  Instructor,
  Student,
  Admin,
  SuperAdmin,
};
