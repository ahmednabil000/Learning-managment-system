const courseService = require("../services/courseService");
const paginationValidation = require("../validations/paginationValidation");

exports.getCourseById = async (req, res) => {
    try {
        const course = await courseService.getCourseById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCourses = async (req, res) => {
    try {
        const { page, pageCount, search } = await paginationValidation.validateAsync(req.query);
    
        const { courses, totalItems, totalPages } = await courseService.getAllCourses(page, pageCount, search);

        res.json({  
            courses,
            page,
            pageCount,
            totalItems,
            totalPages,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null
        });
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};
