import { useState } from "react";
// import { useTranslation } from "react-i18next";
import { useEnrolledCourses } from "../../hooks/useCourses";
import CourseCard from "./components/CourseCard";
import Button from "../../shared/components/Button";
import { Link } from "react-router-dom";

const MyEnrolledCoursesPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error } = useEnrolledCourses({
    page,
    limit,
  });

  const courses = data?.courses || [];
  const totalPages = data?.totalPages || 1;

  if (isLoading) {
    return (
      <div className="py-12 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="heading-xl text-primary mb-8">My Enrolled Courses</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-surface animate-pulse h-80 rounded-xl border border-border"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="heading-xl text-primary mb-8">My Enrolled Courses</h1>
          <div className="bg-error/10 border border-error text-error p-4 rounded-lg">
            {error?.message ||
              "Something went wrong while fetching your courses."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="heading-xl text-primary mb-2">
              My Enrolled Courses
            </h1>
            <p className="body text-text-muted">
              Continue learning where you left off.
            </p>
          </div>
          <Link to="/courses">
            <Button variant="outline">Browse More Courses</Button>
          </Link>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} isEnrolled={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface rounded-3xl border border-border">
            <h2 className="heading-m text-text-main mb-4">
              You haven't enrolled in any courses yet.
            </h2>
            <Link to="/courses">
              <Button variant="primary">Explore Courses</Button>
            </Link>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? "primary" : "outline"}
                size="sm"
                onClick={() => setPage(i + 1)}
                className="w-10 h-10 p-0"
              >
                {i + 1}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEnrolledCoursesPage;
