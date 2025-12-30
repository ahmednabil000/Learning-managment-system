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

  const price = parseFloat(course.price);
  const salePrice = parseFloat(course.salePrice);
  const discount = parseFloat(course.discount);

  // Consider it a sale if discount is present & positive, and we have a valid salePrice
  // OR if we have a salePrice that is strictly less than the regular price
  const isSale =
    (discount > 0 && !isNaN(salePrice)) ||
    (!isNaN(salePrice) && !isNaN(price) && salePrice < price);

  return (
    <Link to={`/courses/${course._id}`} className="block h-full">
      <Card className="p-0 overflow-hidden flex flex-col h-full bg-surface border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
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
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-primary text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm border border-border">
              {course.category}
            </span>
          )}
          {isSale && discount > 0 && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
              -{Math.round(discount)}%
            </span>
          )}
        </div>

        <div className="p-5 flex flex-col grow">
          <h3 className="text-lg font-bold text-text-main mb-2 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-sm text-text-muted mb-4 line-clamp-2 flex-grow">
            {course.description}
          </p>

          <div className="mt-auto space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                {course.rating !== undefined && (
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-100">
                    <FaStar className="text-yellow-400 h-3.5 w-3.5" />
                    <span className="text-yellow-700 font-semibold text-xs">
                      {course.rating}
                    </span>
                  </div>
                )}
                {course.students !== undefined && (
                  <span className="text-text-muted text-xs font-medium">
                    {course.students} {t("courses.students")}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex flex-col">
                {isSale ? (
                  <>
                    <span className="text-xl font-bold text-primary">
                      ${salePrice}
                    </span>
                    <span className="text-xs text-text-muted line-through">
                      ${price}
                    </span>
                  </>
                ) : (
                  <span className="text-xl font-bold text-primary">
                    ${price}
                  </span>
                )}
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleEnroll}
                className="px-5 rounded-lg"
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
    salePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    discount: PropTypes.number,
    isSale: PropTypes.bool,
    imageUrl: PropTypes.string,
    category: PropTypes.string,
    rating: PropTypes.number,
    students: PropTypes.number,
  }).isRequired,
};

export default CourseCard;
