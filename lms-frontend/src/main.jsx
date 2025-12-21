import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n/i18n";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router-dom";
import HomePage from "./features/Home/HomePage";

import MainLayout from "./shared/layouts/MainLayout";

import LoginPage from "./features/Auth/LoginPage";
import SignupPage from "./features/Auth/SignupPage";

import CoursesPage from "./features/Courses/CoursesPage";

import AuthSuccess from "./features/Auth/AuthSuccess";

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
    ],
  },
]);

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
