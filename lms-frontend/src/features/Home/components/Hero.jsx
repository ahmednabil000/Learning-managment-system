import { Link } from "react-router-dom";
import Button from "../../../shared/components/Button";
import { useTranslation } from "react-i18next";
import useAuthStore from "../../../Stores/authStore";

const Hero = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="relative bg-primary overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="heading-xl text-white mb-6">
            {t("hero.title")}{" "}
            <span className="text-secondary-200">EduSphere</span>
          </h1>
          <p className="body-lg text-white/90 mb-8">{t("hero.subtitle")}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/courses">
              <Button
                variant="accent"
                size="lg"
                className="w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                {t("hero.explore")}
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link to="/auth/signup">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                >
                  {t("hero.join")}
                </Button>
              </Link>
            )}
          </div>

          <div className="mt-12 flex justify-center items-center space-x-8 rtl:space-x-reverse text-white/80">
            <div className="text-center">
              <div className="text-3xl font-bold">10k+</div>
              <div className="text-sm">{t("hero.stats.students")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">200+</div>
              <div className="text-sm">{t("hero.stats.courses")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm">{t("hero.stats.instructors")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
