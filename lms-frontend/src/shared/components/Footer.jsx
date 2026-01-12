import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="heading-m text-primary font-bold">
              EduSphere
            </Link>
            <p className="body-sm text-text-muted max-w-xs">
              {t("footer.about")}
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-text-muted hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-text-muted hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-text-muted hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-text-muted hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="heading-s font-semibold text-text-main mb-4">
              {"platform"}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/courses"
                  className="body-sm text-text-muted hover:text-primary transition-colors"
                >
                  {"courses"}
                </Link>
              </li>
              <li>
                <Link
                  to="/tracks"
                  className="body-sm text-text-muted hover:text-primary transition-colors"
                >
                  {"tracks"}
                </Link>
              </li>
              <li>
                <Link
                  to="/instructors"
                  className="body-sm text-text-muted hover:text-primary transition-colors"
                >
                  {t("hero.stats.instructors")}
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="body-sm text-text-muted hover:text-primary transition-colors"
                >
                  {t("pricing")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="heading-s font-semibold text-text-main mb-4">
              {t("footer.resources")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/blog"
                  className="body-sm text-text-muted hover:text-primary transition-colors"
                >
                  {t("blog")}
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="body-sm text-text-muted hover:text-primary transition-colors"
                >
                  {t("careers")}
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="body-sm text-text-muted hover:text-primary transition-colors"
                >
                  {t("faq")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="body-sm text-text-muted hover:text-primary transition-colors"
                >
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="heading-s font-semibold text-text-main mb-4">
              {t("footer.stay_updated")}
            </h3>
            <p className="body-sm text-text-muted mb-4">
              {t("footer.newsletter_description")}
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder={t("footer.email_placeholder")}
                className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-surface"
              />
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-2 text-white font-medium px-4 py-2 rounded-lg transition-colors"
              >
                {t("footer.subscribe")}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="body-sm text-text-muted text-center md:text-left">
            &copy; {new Date().getFullYear()} EduSphere. {t("footer.rights")}
          </p>
          <div className="flex space-x-6 rtl:space-x-reverse mt-4 md:mt-0">
            <Link
              to="/privacy-policy"
              className="body-sm text-text-muted hover:text-primary transition-colors"
            >
              {t("footer.privacy_policy")}
            </Link>
            <Link
              to="/terms-of-service"
              className="body-sm text-text-muted hover:text-primary transition-colors"
            >
              {t("footer.terms_of_service")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
