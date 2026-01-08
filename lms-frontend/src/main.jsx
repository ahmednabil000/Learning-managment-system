import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n/i18n";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./features/Home/HomePage";

import MainLayout from "./shared/layouts/MainLayout";

import LoginPage from "./features/Auth/LoginPage";
import SignupPage from "./features/Auth/SignupPage";

import CoursesPage from "./features/Courses/CoursesPage";
import MyEnrolledCoursesPage from "./features/Courses/MyEnrolledCoursesPage";
import CourseDetailsPage from "./features/Courses/CourseDetailsPage";
import LessonViewPage from "./features/Courses/LessonViewPage";
import StudentAssignmentPage from "./features/Courses/StudentAssignmentPage";
import ExamPage from "./features/Courses/ExamPage";
import InstructorDetailsPage from "./features/Instructors/InstructorDetailsPage";
import TracksPage from "./features/Tracks/TracksPage";
import TrackDetailsPage from "./features/Tracks/TrackDetailsPage";

import AuthSuccess from "./features/Auth/AuthSuccess";
import PaymentCompletionPage from "./features/payments/PaymentCompletionPage";
import CheckoutForm from "./features/payments/CheckoutForm";

import DashboardLayout from "./shared/layouts/DashboardLayout";
import InstructorDashboard from "./features/Dashboard/InstructorDashboard";
import MyCoursesPage from "./features/Dashboard/MyCoursesPage";
import CourseFormPage from "./features/Dashboard/CourseFormPage";
import InstructorTracksPage from "./features/Dashboard/InstructorTracksPage";
import TrackFormPage from "./features/Dashboard/TrackFormPage";

import NotAuthorized from "./shared/components/NotAuthorized";
import NotFound from "./shared/components/NotFound";
import LiveSessionPage from "./features/LiveSessions/LiveSessionPage";
import RecordingPlaybackPage from "./features/LiveSessions/RecordingPlaybackPage";
import InstructorLiveSessionsPage from "./features/Dashboard/InstructorLiveSessionsPage";
import BlogDetailsPage from "./features/Courses/BlogDetailsPage";
import CreateCourseBlogPage from "./features/Dashboard/CreateCourseBlogPage";
import CourseBlogViewPage from "./features/Courses/CourseBlogViewPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "auth/login",
        element: <LoginPage />,
      },
      {
        path: "auth/signup",
        element: <SignupPage />,
      },
      {
        path: "auth-success",
        element: <AuthSuccess />,
      },
      {
        path: "completion",
        element: <PaymentCompletionPage />,
      },
      {
        path: "checkout/:courseId",
        element: (
          <ProtectedRoute roles={["Student"]}>
            <CheckoutForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "courses",
        element: <CoursesPage />,
      },
      {
        path: "my-courses",
        element: (
          <ProtectedRoute>
            <MyEnrolledCoursesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "courses/:courseId",
        element: <CourseDetailsPage />,
      },
      {
        path: "tracks",
        element: <TracksPage />,
      },
      {
        path: "tracks/:trackId",
        element: <TrackDetailsPage />,
      },
      {
        path: "courses/:courseId/lessons/:lessonId",
        element: <LessonViewPage />,
      },
      {
        path: "courses/:courseId/assignments/:assignmentId",
        element: <StudentAssignmentPage />,
      },
      {
        path: "courses/:courseId/exams/:examId",
        element: <ExamPage />,
      },
      {
        path: "instructors/:instructorId",
        element: <InstructorDetailsPage />,
      },
      {
        path: "blogs/:blogId",
        element: <BlogDetailsPage />,
      },
      {
        path: "courses/:courseId/blogs/:blogId",
        element: <CourseBlogViewPage />,
      },
      {
        path: "live-session/:sessionName",
        element: <LiveSessionPage />,
      },
      {
        path: "live-session/:sessionName/recording",
        element: <RecordingPlaybackPage />,
      },
      {
        path: "unauthorized",
        element: <NotAuthorized />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute roles={["Instructor"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <InstructorDashboard />,
      },
      {
        path: "courses",
        element: <MyCoursesPage />,
      },
      {
        path: "courses/new",
        element: <CourseFormPage mode="create" />,
      },
      {
        path: "courses/:id/edit",
        element: <CourseFormPage mode="edit" />,
      },
      {
        path: "tracks",
        element: <InstructorTracksPage />,
      },
      {
        path: "tracks/new",
        element: <TrackFormPage mode="create" />,
      },
      {
        path: "tracks/:id/edit",
        element: <TrackFormPage mode="edit" />,
      },
      {
        path: "courses/:courseId/create-blog",
        element: <CreateCourseBlogPage />,
      },
      {
        path: "live-sessions",
        element: <InstructorLiveSessionsPage />,
      },
    ],
  },
]);

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./shared/components/ProtectedRoute";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </QueryClientProvider>
  </StrictMode>
);
