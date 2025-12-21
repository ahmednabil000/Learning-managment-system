import { Link } from "react-router-dom";
import Button from "../../../shared/components/Button";
import { useTranslation } from "react-i18next";
import useAuthStore from "../../../Stores/authStore";

const CallToAction = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="py-20 bg-linear-to-r from-primary to-primary-2 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="heading-l mb-6">{t("cta.title")}</h2>
        <p className="body-lg text-white/90 mb-10 max-w-2xl mx-auto">
          {t("cta.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {!isAuthenticated && (
            <Link to="/auth/signup">
              <Button variant="surface" size="lg">
                {t("cta.get_started")}
              </Button>
            </Link>
          )}
          <Link to="/courses">
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              size="lg"
            >
              {t("cta.browse")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
