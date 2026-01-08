import { useParams, useNavigate } from "react-router-dom";
import { useInstructor } from "../../hooks/useInstructors";
import { useCourses } from "../../hooks/useCourses";
import Button from "../../shared/components/Button";
import {
  FaUserCircle,
  FaEnvelope,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaBookOpen,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useState } from "react";
import CourseCard from "../Courses/components/CourseCard";

const InstructorDetailsPage = () => {
  const { instructorId } = useParams();
  const navigate = useNavigate();
  const [coursesPage, setCoursesPage] = useState(1);
  const coursesLimit = 6;

  const { data: instructor, isLoading, isError } = useInstructor(instructorId);
  const { data: coursesData, isLoading: isLoadingCourses } = useCourses({
    page: coursesPage,
    pageCount: coursesLimit,
    instructor: instructorId,
  });

  const instructorCourses = coursesData?.shortCourses || [];
  const totalPages = coursesData?.totalPages || 1;
  const totalItems = coursesData?.totalItems;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !instructor) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-text-main mb-2">
          Instructor Not Found
        </h2>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden mb-8">
          {/* Header/Cover */}
          <div className="h-40 bg-gradient-to-r from-primary/20 to-accent/20 w-full relative">
            <div className="absolute -bottom-12 left-8">
              <div className="h-32 w-32 rounded-full border-4 border-surface bg-background overflow-hidden relative shadow-md">
                {instructor.imageUrl ? (
                  <img
                    src={instructor.imageUrl}
                    alt={instructor.firstName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                    <FaUserCircle size={80} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-16 pb-6 px-8 flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-text-main">
                {instructor.firstName} {instructor.lastName}
              </h1>
              <p className="text-primary font-medium flex items-center gap-2 mt-1">
                <FaChalkboardTeacher /> {instructor.role || "Instructor"}
              </p>
              <div className="flex items-center gap-4 mt-3 text-sm text-text-muted">
                {totalItems !== undefined && (
                  <span className="flex items-center gap-1">
                    <FaBookOpen /> {totalItems} Courses
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <FaCalendarAlt /> Joined{" "}
                  {new Date(instructor.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            {instructor.email && (
              <a
                href={`mailto:${instructor.email}`}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-text-main hover:bg-background transition-colors text-sm font-medium"
              >
                <FaEnvelope className="text-primary" /> Contact
              </a>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <div className="bg-surface rounded-xl p-8 border border-border shadow-sm">
            <h3 className="text-lg font-bold text-text-main mb-4">About Me</h3>
            <p className="text-text-muted leading-relaxed whitespace-pre-wrap">
              {instructor.description || "No biography available."}
            </p>
          </div>

          {/* Courses Section */}
          <div className="bg-surface rounded-xl p-8 border border-border shadow-sm">
            <h3 className="text-lg font-bold text-text-main mb-6">
              My Courses
            </h3>
            {isLoadingCourses ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
              </div>
            ) : instructorCourses.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {instructorCourses.map((course) => (
                    <CourseCard key={course._id} course={course} />
                  ))}
                </div>
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCoursesPage((p) => Math.max(1, p - 1))}
                      disabled={coursesPage === 1}
                    >
                      <FaChevronLeft /> Prev
                    </Button>
                    <span className="text-sm font-medium text-text-muted">
                      Page {coursesPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCoursesPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={coursesPage === totalPages}
                    >
                      Next <FaChevronRight />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-text-muted bg-surface rounded-xl border border-border">
                <p>No courses found for this instructor.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDetailsPage;
