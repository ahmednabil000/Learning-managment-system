import PropTypes from "prop-types";
import Card from "../../../shared/components/Card";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../../shared/components/Button";

import { toast } from "react-toastify";

const CourseCard = ({ course }) => {
  const { t } = useTranslation();

  const handleEnroll = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(
      `${t("courses.enroll_success") || "Successfully enrolled in"} ${
        course.title
      }!`
    );
  };

  return (
    <Card className="p-0 overflow-hidden flex flex-col h-full group bg-surface border-border/50 hover:shadow-2xl transition-all duration-500 rounded-2xl border-none shadow-sm relative">
      <Link
        to={`/courses/${course._id}`}
        className="block relative overflow-hidden"
      >
        <img
          src={
            course.image || "https://via.placeholder.com/400x225?text=Course"
          }
          alt={course.title}
          className="w-full h-52 object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {course.category && (
          <span className="absolute top-4 left-4 right-auto rtl:right-4 rtl:left-auto bg-primary/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
            {course.category}
          </span>
        )}
      </Link>

      <div className="p-6 flex flex-col grow">
        <Link to={`/courses/${course._id}`}>
          <h3 className="text-lg font-bold text-text-main mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
            {course.title}
          </h3>
        </Link>
        <p className="text-sm text-text-muted mb-6 line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center bg-warning/10 px-2 py-1 rounded-lg">
              {course.rating !== undefined && (
                <>
                  <span className="text-warning font-bold text-sm mr-1 rtl:ml-1 rtl:mr-0">
                    {course.rating}
                  </span>
                  <FaStar className="text-warning h-3.5 w-3.5" />
                </>
              )}
              {course.students !== undefined && (
                <span className="text-[11px] text-text-muted font-medium ml-2 rtl:mr-2 rtl:ml-0 border-l border-border/50 pl-2 rtl:pr-2 rtl:pl-0">
                  {course.students} {t("courses.students")}
                </span>
              )}
            </div>
            <span className="text-xl font-bold text-secondary leading-none">
              ${course.price}
            </span>
          </div>

          <Button
            variant="primary"
            className="w-full shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transform active:scale-[0.98] transition-all"
            size="md"
            onClick={handleEnroll}
          >
            {t("courses.enroll_now")}
          </Button>
        </div>
      </div>
    </Card>
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
