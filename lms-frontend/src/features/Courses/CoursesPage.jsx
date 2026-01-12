import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useCourses } from "../../hooks/useCourses";
import CourseCard from "./components/CourseCard";
import { FaSearch } from "react-icons/fa";
import Button from "../../shared/components/Button";

const CoursesPage = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageCount = 12;

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const { data, isLoading, isError, error } = useCourses({
    page,
    pageCount,
    search: debouncedSearch,
  });

  const courses = data?.shortCourses || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="heading-xl text-primary mb-2">
              {t("courses.all_courses")}
            </h1>
            <p className="body text-text-muted">
              {t("courses.browse_subtitle")}
            </p>
          </div>

          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-text-muted" />
            </div>
            <input
              type="text"
              placeholder={
                t("courses.search_placeholder") || "Search courses..."
              }
              className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between">
          <p className="body-sm text-text-muted">
            {isLoading
              ? t("common.loading")
              : `${t("courses.showing")} ${courses.length} ${t(
                  "courses.results"
                )}`}
          </p>
        </div>

        {/* Error State */}
        {isError && (
          <div className="bg-error/10 border border-error text-error p-4 rounded-lg mb-8">
            {error?.message || "Something went wrong while fetching courses."}
          </div>
        )}

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Skeleton handles
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-surface animate-pulse h-80 rounded-xl border border-border"
              ></div>
            ))
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="heading-m text-text-muted">
                {t("courses.no_results")}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSearch("")}
              >
                {t("courses.clear_search")}
              </Button>
            </div>
          )}
        </div>

        {/* Pagination */}
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

export default CoursesPage;
