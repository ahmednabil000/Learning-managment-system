import PropTypes from "prop-types";
import Card from "../../../shared/components/Card";
import { FaStar } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../../shared/components/Button";

const CourseCard = ({ course }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleEnroll = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/checkout/${course._id}`);
  };

  return (
    <Link to={`/courses/${course._id}`} className="block h-full">
      <Card className="p-0 overflow-hidden flex flex-col h-full bg-white border border-gray-200 rounded-lg">
        <div className="relative overflow-hidden">
          <img
            src={
              course.imageUrl ||
              "https://via.placeholder.com/400x225?text=Course"
            }
            alt={course.title}
            className="w-full h-48 object-cover"
          />
          {course.category && (
            <span className="absolute top-3 left-3 right-auto rtl:right-3 rtl:left-auto bg-primary text-white text-xs font-semibold px-3 py-1 rounded-md">
              {course.category}
            </span>
          )}
        </div>

        <div className="p-5 flex flex-col grow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
            {course.description}
          </p>

          <div className="mt-auto space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                {course.rating !== undefined && (
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400 h-4 w-4" />
                    <span className="text-gray-700 font-medium">
                      {course.rating}
                    </span>
                  </div>
                )}
                {course.students !== undefined && (
                  <span className="text-gray-500">
                    ({course.students} {t("courses.students")})
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-2xl font-bold text-primary">
                ${course.price}
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={handleEnroll}
                className="px-4"
              >
                {t("courses.enroll_now")}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

CourseCard.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    image: PropTypes.string,
    category: PropTypes.string,
    rating: PropTypes.number,
    students: PropTypes.number,
  }).isRequired,
};

export default CourseCard;
