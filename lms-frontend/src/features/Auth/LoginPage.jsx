import { Link, useLocation, useSearchParams } from "react-router-dom";
import Button from "../../shared/components/Button";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import InputError from "../../shared/components/InputError";

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const callback = searchParams.get("callback");
  const state = callback ? encodeURIComponent(callback) : "";

  const onSubmit = (data) => {
    console.log(data);
    // TODO: Implement login logic here
  };

  const loginWithGoogle = () => {
    window.open(
      `${import.meta.env.VITE_API_URL}/auth/google?state=${state}`,
      "_self"
    );
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
            >
              {t("login.submit")}
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

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={loginWithGoogle}
            >
              <FaGoogle className="mr-2" /> Google
            </Button>
            <Button variant="outline" className="w-full justify-center">
              <FaGithub className="mr-2" /> GitHub
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
