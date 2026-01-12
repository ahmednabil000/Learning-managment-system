import { Link } from "react-router-dom";
import Button from "../../../shared/components/Button";
import { useTranslation } from "react-i18next";
import { useTopCourses } from "../../../hooks/useCourses";
import CourseCard from "../../Courses/components/CourseCard";

const PopularCourses = () => {
  const { t } = useTranslation();
  const { data: topCourses, isLoading } = useTopCourses(3);

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="heading-l text-primary mb-2">
              {t("courses.title")}
            </h2>
            <p className="body text-text-muted">{t("courses.subtitle")}</p>
          </div>
          <Link to="/courses" className="hidden sm:block">
            <Button variant="outline" size="sm">
              {t("courses.view_all")}
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topCourses?.map((course) => (
              <div key={course._id} className="h-full">
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center sm:hidden">
          <Link to="/courses">
            <Button variant="outline" className="w-full">
              {t("courses.view_all")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularCourses;
