import { Link } from "react-router-dom";
import Card from "../../../shared/components/Card";
import Button from "../../../shared/components/Button";
import { FaStar, FaUser } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const PopularCourses = () => {
  const { t } = useTranslation();
  // Dummy data for now
  const courses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: "Dr. Angela Yu",
      rating: 4.8,
      students: 15400,
      price: "$19.99",
      image: "https://via.placeholder.com/400x225?text=Web+Dev",
      category: "Development",
    },
    {
      id: 2,
      title: "Data Science and Machine Learning",
      instructor: "Jose Portilla",
      rating: 4.7,
      students: 12300,
      price: "$24.99",
      image: "https://via.placeholder.com/400x225?text=Data+Science",
      category: "Data Science",
    },
    {
      id: 3,
      title: "Graphic Design Masterclass",
      instructor: "Lindsay Marsh",
      rating: 4.9,
      students: 8500,
      price: "$14.99",
      image: "https://via.placeholder.com/400x225?text=Design",
      category: "Design",
    },
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="p-0 overflow-hidden flex flex-col h-full group cursor-pointer hover:shadow-xl transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 right-auto rtl:right-4 rtl:left-auto bg-surface/90 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {course.category}
                </span>
              </div>

              <div className="p-6 flex flex-col grow">
                <h3 className="heading-m text-text-main mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="body-sm text-text-muted mb-4 flex items-center">
                  <FaUser className="mr-2 rtl:ml-2 rtl:mr-0 text-text-muted" />{" "}
                  {course.instructor}
                </p>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <span className="text-warning font-bold">
                      {course.rating}
                    </span>
                    <FaStar className="text-warning h-4 w-4" />
                    <span className="text-xs text-text-muted">
                      ({course.students})
                    </span>
                  </div>
                  <span className="heading-m text-secondary">
                    {course.price}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

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
