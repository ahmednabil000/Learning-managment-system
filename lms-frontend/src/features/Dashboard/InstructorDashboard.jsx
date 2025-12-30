import { useTranslation } from "react-i18next";
import useAuthStore from "../../Stores/authStore";
import { useQuery } from "@tanstack/react-query";
import {
  getCoursesCount,
  getEnrolledUsersCount,
  getTotalRevenue,
  getTopCourses,
  getEnrollmentsByCourse,
  getInstructorRate,
} from "../../services/AnalyticsService";
import { Chart } from "react-charts";
import { useMemo } from "react";
import {
  FiUsers,
  FiDollarSign,
  FiBookOpen,
  FiActivity,
  FiStar,
} from "react-icons/fi";

const InstructorDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const { data: coursesData, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["coursesCount"],
    queryFn: () => getCoursesCount(),
  });

  const { data: studentsData, isLoading: isLoadingStudents } = useQuery({
    queryKey: ["enrolledUsersCount"],
    queryFn: () => getEnrolledUsersCount(),
  });

  const { data: revenueData, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ["totalRevenue"],
    queryFn: () => getTotalRevenue(),
  });

  const { data: topCoursesData, isLoading: isLoadingTopCourses } = useQuery({
    queryKey: ["topCourses"],
    queryFn: () => getTopCourses({ limit: 5 }),
  });

  const { data: enrollmentsData, isLoading: isLoadingEnrollments } = useQuery({
    queryKey: ["enrollmentsByCourse"],
    queryFn: () => getEnrollmentsByCourse(),
  });

  const { data: instructorRateData, isLoading: isLoadingRate } = useQuery({
    queryKey: ["instructorRate"],
    queryFn: () => getInstructorRate(),
  });

  // Chart Data Configuration
  const chartData = useMemo(() => {
    if (!enrollmentsData?.data || enrollmentsData.data.length === 0) return [];

    return [
      {
        label: "Enrollments",
        data: enrollmentsData.data.map((course) => ({
          primary:
            course.title.length > 15
              ? course.title.substring(0, 15) + "..."
              : course.title,
          secondary: course.count,
        })),
      },
    ];
  }, [enrollmentsData]);

  const primaryAxis = useMemo(
    () => ({
      getValue: (datum) => datum.primary,
    }),
    []
  );

  const secondaryAxes = useMemo(
    () => [
      {
        getValue: (datum) => datum.secondary,
        elementType: "bar",
      },
    ],
    []
  );

  const stats = [
    {
      label: "Total Students",
      value: studentsData?.count ?? 0,
      icon: <FiUsers className="w-6 h-6" />,
      color: "text-blue-500 bg-blue-50",
    },
    {
      label: "Total Revenue",
      value: `$${revenueData?.revenue ?? 0}`,
      icon: <FiDollarSign className="w-6 h-6" />,
      color: "text-green-500 bg-green-50",
    },
    {
      label: "Active Courses",
      value: coursesData?.count ?? 0,
      icon: <FiBookOpen className="w-6 h-6" />,
      color: "text-purple-500 bg-purple-50",
    },
    {
      label: "Instructor Rating",
      value: instructorRateData?.averageRate
        ? instructorRateData.averageRate.toFixed(1)
        : "N/A",
      icon: <FiStar className="w-6 h-6" />,
      color: "text-yellow-500 bg-yellow-50",
    },
  ];

  const isLoading =
    isLoadingCourses ||
    isLoadingStudents ||
    isLoadingRevenue ||
    isLoadingTopCourses ||
    isLoadingEnrollments ||
    isLoadingRate;

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <div className="animate-pulse text-text-muted">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="heading-l text-text-main">
          {t("dashboard.welcome", { name: user?.name || "Instructor" })}
          👋
        </h1>
        <p className="text-text-muted mt-2">Here is your analytics overview.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface p-6 rounded-2xl border border-border shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-text-muted">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-text-main mt-1">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-full ${stat.color}`}>{stat.icon}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Courses List - takes 1 col */}
        <div className="bg-surface p-6 rounded-2xl border border-border h-full lg:col-span-1">
          <h2 className="text-lg font-bold text-text-main mb-4">
            Top Performing Courses
          </h2>
          <div className="space-y-4">
            {topCoursesData?.data?.map((course, i) => (
              <div
                key={course.courseId}
                className="flex items-center space-x-4 p-4 rounded-xl border border-border border-dashed hover:bg-surface-hover/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-sm font-medium text-text-main truncate"
                    title={course.title}
                  >
                    {course.title}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {course.count} Enrollments
                  </p>
                </div>
              </div>
            ))}
            {(!topCoursesData?.data || topCoursesData.data.length === 0) && (
              <p className="text-text-muted text-sm">No courses yet.</p>
            )}
          </div>
        </div>

        {/* Chart - takes 2 cols */}
        <div className="bg-surface p-6 rounded-2xl border border-border min-h-[400px] lg:col-span-2 flex flex-col">
          <h2 className="text-lg font-bold text-text-main mb-4">
            Enrollments Breakdown
          </h2>
          <div className="flex-1 min-h-[300px]">
            {chartData.length > 0 ? (
              <Chart
                options={{
                  data: chartData,
                  primaryAxis,
                  secondaryAxes,
                  dark: false,
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-text-muted">
                No enrollment data to display.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
