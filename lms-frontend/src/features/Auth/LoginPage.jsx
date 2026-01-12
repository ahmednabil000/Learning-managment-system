import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import Button from "../../shared/components/Button";
import InputError from "../../shared/components/InputError";
import AuthService from "../../services/AuthService";
import useAuthStore from "../../Stores/authStore";
import notification from "../../utils/notification";

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const callback = searchParams.get("callback");
  const state = callback ? encodeURIComponent(callback) : "";

  const loginWithGoogle = () => {
    window.open(
      `${import.meta.env.VITE_API_URL}/auth/google?state=${state}`,
      "_self"
    );
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login({
        email: data.email,
        password: data.password,
      });
      setToken(response.token, data.rememberMe);
      notification.success(
        t("login.success") || "Welcome back! You have successfully logged in."
      );
      if (callback) {
        window.location.href = callback;
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      notification.error(
        error.response?.data?.message ||
          t("login.error") ||
          "Unable to log in. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px-300px)] flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface p-10 rounded-xl shadow-lg border border-border">
        <div className="text-center">
          <h2 className="heading-l text-primary font-bold">
            {t("login.title")}
          </h2>
          <p className="mt-2 text-text-muted body-sm">{t("login.subtitle")}</p>
        </div>

        <div className="mt-8 bg-linear-to-r from-blue-50 to-indigo-50 border border-indigo-100 rounded-xl p-5 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              Instructor Demo Access
            </h3>
            <div className="space-y-2 text-sm text-indigo-800">
              <div className="flex items-center justify-between bg-white/60 p-2 rounded-lg border border-indigo-100/50">
                <span className="text-xs font-semibold text-indigo-600 uppercase">
                  Email
                </span>
                <code className="font-mono font-bold select-all cursor-pointer hover:text-indigo-600 transition-colors">
                  test@gmail.com
                </code>
              </div>
              <div className="flex items-center justify-between bg-white/60 p-2 rounded-lg border border-indigo-100/50">
                <span className="text-xs font-semibold text-indigo-600 uppercase">
                  Password
                </span>
                <code className="font-mono font-bold select-all cursor-pointer hover:text-indigo-600 transition-colors">
                  test
                </code>
              </div>
            </div>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-main"
              >
                {t("login.email")}
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background ${
                  errors.email ? "border-red-500" : "border-border"
                }`}
                placeholder="you@example.com"
                {...register("email", {
                  required: t("login.email_required") || "Email is required", // Fallback if translation missing
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              <InputError message={errors.email?.message} />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-main"
              >
                {t("login.password")}
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background ${
                  errors.password ? "border-red-500" : "border-border"
                }`}
                placeholder="********"
                {...register("password", {
                  required:
                    t("login.password_required") || "Password is required",
                })}
              />
              <InputError message={errors.password?.message} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                {...register("rememberMe")}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-text-muted"
              >
                {t("login.remember")}
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-secondary hover:text-blue-500"
              >
                {t("login.forgot")}
              </a>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : t("login.submit")}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface text-text-muted">
                {" "}
                {t("login.or")}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={loginWithGoogle}
            >
              <FaGoogle className="mr-2" /> Google
            </Button>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-text-muted">
            {t("login.signup_prompt")}{" "}
            <Link
              to="/auth/signup"
              className="font-medium text-primary hover:text-primary-2"
            >
              {t("login.signup_link")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
