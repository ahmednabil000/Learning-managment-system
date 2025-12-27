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
import CourseDetailsPage from "./features/Courses/CourseDetailsPage";
import LessonViewPage from "./features/Courses/LessonViewPage";

import AuthSuccess from "./features/Auth/AuthSuccess";

import DashboardLayout from "./shared/layouts/DashboardLayout";
import InstructorDashboard from "./features/Dashboard/InstructorDashboard";
import MyCoursesPage from "./features/Dashboard/MyCoursesPage";
import CourseFormPage from "./features/Dashboard/CourseFormPage";

import NotAuthorized from "./shared/components/NotAuthorized";
import NotFound from "./shared/components/NotFound";
import LiveSessionPage from "./features/LiveSessions/LiveSessionPage";
import RecordingPlaybackPage from "./features/LiveSessions/RecordingPlaybackPage";
import InstructorLiveSessionsPage from "./features/Dashboard/InstructorLiveSessionsPage";

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
        path: "courses",
        element: <CoursesPage />,
      },
      {
        path: "courses/:courseId",
        element: <CourseDetailsPage />,
      },
      {
        path: "courses/:courseId/lessons/:lessonId",
        element: <LessonViewPage />,
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
