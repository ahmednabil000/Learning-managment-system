import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineUserCircle, HiChevronDown } from "react-icons/hi";
import useAuthStore from "../../Stores/authStore";

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, clearToken } = useAuthStore();
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    clearToken();
    navigate("/");
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-background transition-colors focus:outline-none"
      >
        <div className="flex flex-col items-end hidden sm:flex">
          <span className="text-sm font-semibold text-text-main">
            {user?.name || user?.email}
          </span>
          <span className="text-xs text-text-muted capitalize">
            {user?.role}
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <HiOutlineUserCircle className="w-6 h-6" />
        </div>
        <HiChevronDown
          className={`w-4 h-4 text-text-muted transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-xl shadow-lg py-2 z-50 transform origin-top-right animate-in fade-in zoom-in duration-200">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium text-text-main truncate">
              {user?.name}
            </p>
            <p className="text-xs text-text-muted truncate">{user?.email}</p>
          </div>

          <div className="py-1">
            {user?.role === "Instructor" && (
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 mx-2 px-4 py-3 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary-2 shadow-lg shadow-primary/20 transition-all duration-200 active:scale-[0.98] group"
              >
                <div className="p-1.5 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                    />
                  </svg>
                </div>
                <span>Dashboard</span>
              </Link>
            )}
            {user.role === "Instructor" && (
              <Link
                to={`/instructors/${user.id}`}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm text-text-main hover:bg-background transition-colors"
              >
                My Profile
              </Link>
            )}
          </div>

          <div className="border-t border-border mt-1 py-1">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/5 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
