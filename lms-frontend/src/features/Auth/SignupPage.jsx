import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../shared/components/Button";
import { FaGoogle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import InputError from "../../shared/components/InputError";
import AuthService from "../../services/AuthService";
import useAuthStore from "../../Stores/authStore";
import notification from "../../utils/notification";

const SignupPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const signupWithGoogle = () => {
    window.open(`${import.meta.env.VITE_API_URL}/auth/google`, "_self");
  };

  const password = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await AuthService.register({
        fullName: data.name,
        email: data.email,
        password: data.password,
      });
      setToken(response.token);
      notification.success(
        t("signup.success") ||
          "Welcome to EduSphere! Your account has been created."
      );
      navigate("/");
    } catch (error) {
      console.error(error);
      notification.error(
        error.response?.data?.message ||
          t("signup.error") ||
          "Unable to create account. Please try again."
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
            {t("signup.title")}
          </h2>
          <p className="mt-2 text-text-muted body-sm">{t("signup.subtitle")}</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-text-main"
              >
                {t("signup.name")}
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background ${
                  errors.name ? "border-red-500" : "border-border"
                }`}
                placeholder="John Doe"
                {...register("name", {
                  required: t("signup.name_required") || "Name is required",
                })}
              />
              <InputError message={errors.name?.message} />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-main"
              >
                {t("signup.email")}
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
                  required: t("signup.email_required") || "Email is required",
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
                {t("signup.password")}
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background ${
                  errors.password ? "border-red-500" : "border-border"
                }`}
                placeholder="********"
                {...register("password", {
                  required:
                    t("signup.password_required") || "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <InputError message={errors.password?.message} />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-text-main"
              >
                {t("signup.confirm_password")}
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background ${
                  errors.confirmPassword ? "border-red-500" : "border-border"
                }`}
                placeholder="********"
                {...register("confirmPassword", {
                  required:
                    t("signup.confirm_password_required") ||
                    "Please confirm your password",
                  validate: (value) =>
                    value === password || "The passwords do not match",
                })}
              />
              <InputError message={errors.confirmPassword?.message} />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              className={`h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded ${
                errors.terms ? "border-red-500" : ""
              }`}
              {...register("terms", {
                required:
                  t("signup.terms_required") ||
                  "You must accept the terms and conditions",
              })}
            />
            <label
              htmlFor="terms"
              className="ml-2 block text-sm text-text-muted"
            >
              {t("signup.terms")}
            </label>
          </div>
          <InputError message={errors.terms?.message} />

          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center"
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : t("signup.submit")}
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
                {t("signup.or")}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={signupWithGoogle}
            >
              <FaGoogle className="mr-2" /> Google
            </Button>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-text-muted">
            {t("signup.login_prompt")}{" "}
            <Link
              to="/auth/login"
              className="font-medium text-primary hover:text-primary-2"
            >
              {t("signup.login_link")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
