import PropTypes from "prop-types";
import Card from "../../../shared/components/Card";
import { FaStar, FaUser, FaArrowRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../../shared/components/Button";

const CourseCard = ({ course, isEnrolled }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleEnroll = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (course.isEnroll || isEnrolled) {
      navigate(`/courses/${course._id}`);
    } else {
      navigate(`/checkout/${course._id}`);
    }
  };

  const price = parseFloat(course.price);
  const salePrice = parseFloat(course.salePrice);
  const discount = parseFloat(course.discount);

  // Consider it a sale if discount is present & positive, and we have a valid salePrice
  // OR if we have a salePrice that is strictly less than the regular price
  const isSale =
    (discount > 0 && !isNaN(salePrice)) ||
    (!isNaN(salePrice) && !isNaN(price) && salePrice < price);

  // Use rate or rating (fallback)
  const ratingValue =
    course.rate !== undefined ? course.rate : course.rating || 0;
  // Use studentsCount or students (fallback)
  const studentsValue =
    course.studentsCount !== undefined
      ? course.studentsCount
      : course.students || 0;

  return (
    <Link to={`/courses/${course._id}`} className="block h-full group">
      <Card className="p-0 overflow-hidden flex flex-col h-full bg-surface border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
          <img
            src={
              course.imageUrl ||
              "https://via.placeholder.com/800x450?text=Course"
            }
            alt={course.title}
            className="w-full h-full object-cover"
          />
          {course.category && (
            <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-primary text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full shadow-sm">
              {course.category}
            </span>
          )}
          {course.level && (
            <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded">
              {course.level}
            </span>
          )}
          {isSale && discount > 0 && !isEnrolled && (
            <span className="absolute top-3 right-3 bg-error text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
              -{Math.round(discount)}%
            </span>
          )}
        </div>

        <div className="p-5 flex flex-col grow">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <FaStar className="text-yellow-400 h-3.5 w-3.5" />
              <span className="text-text-main font-bold text-sm">
                {ratingValue.toFixed(1)}
              </span>
              {course.reviewCount > 0 && (
                <span className="text-text-muted text-xs">
                  ({course.reviewCount})
                </span>
              )}
            </div>
            {studentsValue > 0 && (
              <div className="flex items-center gap-1.5 text-text-muted text-xs">
                <FaUser className="h-3 w-3" />
                <span>{studentsValue}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-text-muted font-medium mb-1">
            {course.instructor?.name || "Instructor"}
          </p>

          <h3 className="text-lg font-bold text-text-main mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-text-muted mb-4 line-clamp-2 flex-grow leading-relaxed">
            {course.description}
          </p>

          <div className="mt-auto pt-4 border-t border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                {!isEnrolled &&
                  (isSale ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-primary">
                        ${salePrice}
                      </span>
                      <span className="text-xs text-text-muted line-through font-medium">
                        ${price}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xl font-bold text-primary">
                      ${price}
                    </span>
                  ))}
              </div>
              <Button
                variant={course.isEnroll || isEnrolled ? "outline" : "primary"}
                size="sm"
                onClick={handleEnroll}
                className={`rounded-lg transition-all ${
                  course.isEnroll || isEnrolled
                    ? "border-primary text-primary hover:bg-primary hover:text-white"
                    : "shadow-lg shadow-primary/20 hover:shadow-primary/40"
                }`}
              >
                {course.isEnroll || isEnrolled ? (
                  <span className="flex items-center gap-2">
                    {t("courses.go_to_course")} <FaArrowRight size={12} />
                  </span>
                ) : (
                  t("courses.enroll_now")
                )}
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
    salePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    discount: PropTypes.number,
    isSale: PropTypes.bool,
    imageUrl: PropTypes.string,
    category: PropTypes.string,
    level: PropTypes.string,
    rating: PropTypes.number,
    rate: PropTypes.number,
    students: PropTypes.number,
    studentsCount: PropTypes.number,
    reviewCount: PropTypes.number,
    isEnroll: PropTypes.bool,
  }).isRequired,
};

export default CourseCard;
