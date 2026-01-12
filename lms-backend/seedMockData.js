const mongoose = require("mongoose");
const Course = require("./src/models/courses/course");
const Track = require("./src/models/courses/track");
const CourseTag = require("./src/models/courses/courseTag");
const { Instructor } = require("./src/models/user");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

async function seedData() {
  try {
    if (!process.env.MONGO_ATLAS) {
      // Fallback if not using MONGO_ATLAS var yet
      console.log(
        "No MONGO_ATLAS env var, relying on default connection logic"
      );
    }
    // Connect explicitly here as this is a standalone script
    await mongoose.connect(process.env.MONGO_ATLAS, {
      dbName: "your_atlas_db_name",
    });
    console.log("Connected to DB");

    // Attempt to clean up rogue index causing issues
    try {
      await CourseTag.collection.dropIndex("id_1");
      console.log("Dropped rogue index id_1 on coursetags");
    } catch (e) {
      // Ignore if index doesn't exist
    }

    // 1. Get or Create an Instructor
    let instructor = await Instructor.findOne({
      email: "instructor@example.com",
    });
    if (!instructor) {
      instructor = await Instructor.create({
        _id: uuidv4(),
        name: "Mock Instructor",
        email: "instructor@example.com",
        googleId: "nothing11",
        description: "An expert instructor for mock data.",
        imageUrl: "https://via.placeholder.com/150",
      });
      console.log("Created Mock Instructor");
    }

    // 2. Create Tags
    const tagsData = [
      { name: "Web Development", description: "All about web dev" },
      { name: "Data Science", description: "All about data" },
      { name: "Design", description: "UI/UX and Art" },
    ];
    let tags = [];
    for (const data of tagsData) {
      let tag = await CourseTag.findOne({ name: data.name });
      if (!tag) {
        tag = await CourseTag.create({ ...data, _id: uuidv4() });
      }
      tags.push(tag);
    }
    console.log("Tags ready");

    // 3. Create Courses
    const coursesData = [
      {
        title: "Complete Web Developer 2026",
        description:
          "Become a full-stack developer with just one course. HTML, CSS, Javascript, Node, React, MongoDB and more!",
        price: 99.99,
        imageUrl: "", // User said they will add thumbnail
        level: "beginner",
        instructor: instructor._id,
        tag: tags[0]._id, // Web Dev
        learning: [
          "HTML5 & CSS3",
          "Modern JavaScript",
          "React & Redux",
          "Node.js & Express",
        ],
        requirements: [
          "No previous experience needed",
          "A computer with internet access",
        ],
      },
      {
        title: "Python for Data Science and Machine Learning Bootcamp",
        description:
          "Learn Python for Data Science and Machine Learning from A-Z. NumPy, Pandas, Matplotlib, Scikit-Learn and more!",
        price: 89.99,
        imageUrl: "",
        level: "intermediate",
        instructor: instructor._id,
        tag: tags[1]._id,
        learning: [
          "Use Python for Data Science",
          "Implement Machine Learning Algorithms",
          "Use Spark for Big Data Analysis",
        ],
        requirements: ["Some programming experience", "Basic math knowledge"],
      },
      {
        title: "User Experience Design Essentials - Adobe XD UI UX Design",
        description:
          "Use XD to get a job in UI Design, User Interface, User Experience design, UX design & Web Design",
        price: 199.99,
        imageUrl: "",
        level: "beginner",
        instructor: instructor._id,
        tag: tags[2]._id,
        learning: [
          "Become a UX designer",
          "Build & test a full mobile app",
          "Work with fonts & colors",
        ],
        requirements: ["No design experience needed"],
      },
      {
        title: "Advanced React Patterns",
        description:
          "Take your React skills to the next level with advanced patterns and performance optimization.",
        price: 129.99,
        imageUrl: "",
        level: "advanced",
        instructor: instructor._id,
        tag: tags[0]._id,
        learning: ["Compound Components", "Render Props", "React Hooks deeply"],
        requirements: ["Solid React knowledge"],
      },
    ];

    let createdCourses = [];
    for (const cData of coursesData) {
      let course = await Course.findOne({ title: cData.title });
      if (!course) {
        course = await Course.create(cData);
        console.log(`Created new course: ${cData.title}`);
      } else {
        console.log(`Course already exists: ${cData.title}`);
      }
      createdCourses.push(course);
    }

    // 4. Create Tracks
    const tracksData = [
      {
        title: "Zero to Hero Web Development Track",
        description:
          "A comprehensive path to becoming a professional web developer.",
        user: instructor._id,
        courses: [createdCourses[0]._id, createdCourses[3]._id], // Web Dev + Advanced React
        discount: 20,
        thumbnail: "",
        isActive: true,
      },
      {
        title: "Data Science Specialization",
        description: "Master data science tools and techniques.",
        user: instructor._id,
        courses: [createdCourses[1]._id], // Just one for now, though track usually implies multiple
        discount: 10,
        thumbnail: "",
        isActive: true,
      },
    ];

    for (const tData of tracksData) {
      const track = await Track.findOne({ title: tData.title });
      if (!track) {
        await Track.create(tData);
        console.log(`Created new track: ${tData.title}`);
      } else {
        console.log(`Track already exists: ${tData.title}`);
      }
    }
    console.log(`Created ${tracksData.length} tracks`);

    console.log("Mock data seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
