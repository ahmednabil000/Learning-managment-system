const { User, Instructor, Student, Admin, SuperAdmin } = require('./user');
const Course = require('./courses/course');

module.exports = {
    User,
    Instructor,
    Student,
    Admin,
    SuperAdmin,
    Course
};
