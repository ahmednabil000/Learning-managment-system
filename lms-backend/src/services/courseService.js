const { Course } = require("../models");

exports.getCourseById = async (id) => {
    const course = await Course.findById(id);
    return course;
};

exports.getAllCourses = async (page, pageCount, search) => {
    const courses = await Course
        .find({
            title: { $regex: search, $options: "i" }
        })
        .skip((page - 1) * pageCount)
        .limit(pageCount);

    const totalItems = await Course.countDocuments({
        title: { $regex: search, $options: "i" }
    });
    const totalPages = Math.ceil(totalItems / pageCount);

    return {
        courses,
        totalItems,
        totalPages
    };
};

exports.createCourse = async ({ title, description, price, image }) => {
    const course = await Course.create({ title, description, price, image });
    return course;
};