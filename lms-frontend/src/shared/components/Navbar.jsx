import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiMenu, HiX } from "react-icons/hi";
import Button from "./Button";
import useAuthStore from "../../Stores/authStore";
import UserDropdown from "./UserDropdown";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const { isAuthenticated, user, clearToken } = useAuthStore();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    document.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  const handleLogout = () => {
    clearToken();
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link to="/" className="heading-m text-primary font-bold">
              EduSphere
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <Link
              to="/"
              className="text-text-main hover:text-primary transition-colors font-medium"
            >
              {t("navbar.home")}
            </Link>
            <Link
              to="/courses"
              className="text-text-main hover:text-primary transition-colors font-medium"
            >
              {t("navbar.courses")}
            </Link>
            <Link
              to="/tracks"
              className="text-text-main hover:text-primary transition-colors font-medium"
            >
              {t("navbar.tracks")}
            </Link>
            <Link
              to="/about"
              className="text-text-main hover:text-primary transition-colors font-medium"
            >
              {t("navbar.about")}
            </Link>
            {isAuthenticated && user?.role !== "Instructor" && (
              <Link
                to="/my-courses"
                className="text-text-main hover:text-primary transition-colors font-medium"
              >
                {"My Learning"}
              </Link>
            )}
          </div>

          {/* Auth Buttons & Lang Switcher */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            <Button variant="ghost" size="sm" onClick={toggleLanguage}>
              {i18n.language === "en" ? "العربية" : "English"}
            </Button>

            {isAuthenticated ? (
              <UserDropdown />
            ) : (
              <>
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm">
                    {t("navbar.login")}
                  </Button>
                </Link>
                <Link to="/auth/signup">
                  <Button variant="primary" size="sm">
                    {t("navbar.signup")}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4 rtl:space-x-reverse">
            <Button variant="ghost" size="sm" onClick={toggleLanguage}>
              {i18n.language === "en" ? "AR" : "EN"}
            </Button>
            <button
              onClick={toggleMenu}
              className="text-text-main hover:text-primary p-2 rounded-md focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <HiX className="h-6 w-6" aria-hidden="true" />
              ) : (
                <HiMenu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-surface border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-text-main hover:text-primary hover:bg-background"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("navbar.home")}
            </Link>
            <Link
              to="/courses"
              className="block px-3 py-2 rounded-md text-base font-medium text-text-main hover:text-primary hover:bg-background"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("navbar.courses")}
            </Link>
            <Link
              to="/tracks"
              className="block px-3 py-2 rounded-md text-base font-medium text-text-main hover:text-primary hover:bg-background"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("navbar.tracks")}
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-text-main hover:text-primary hover:bg-background"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("navbar.about")}
            </Link>
            {isAuthenticated && user?.role !== "Instructor" && (
              <Link
                to="/my-courses"
                className="block px-3 py-2 rounded-md text-base font-medium text-text-main hover:text-primary hover:bg-background"
                onClick={() => setIsMenuOpen(false)}
              >
                {"My Learning"}
              </Link>
            )}
          </div>
          <div className="pt-4 pb-4 border-t border-border px-4 space-y-3">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-text-main">
                    {user?.email}
                  </p>
                  <p className="text-xs text-text-muted capitalize">
                    {user?.role}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="block w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button variant="ghost" className="w-full justify-center">
                    {t("navbar.login")}
                  </Button>
                </Link>
                <Link
                  to="/auth/signup"
                  className="block w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button variant="primary" className="w-full justify-center">
                    {t("navbar.signup")}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
