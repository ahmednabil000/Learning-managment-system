import { NavLink } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
  HiOutlineUsers,
  HiOutlineChartBar,
  HiOutlineCog,
  HiOutlineMap,
} from "react-icons/hi";
import { FaClipboardList } from "react-icons/fa";

const menuItems = [
  { name: "Overview", path: "/dashboard", icon: HiOutlineHome, end: true },
  {
    name: "My Courses",
    path: "/dashboard/courses",
    icon: HiOutlineBookOpen,
    end: false,
  },
  {
    name: "Tracks",
    path: "/dashboard/tracks",
    icon: HiOutlineMap,
    end: false,
  },
  {
    name: "Live Sessions",
    path: "/dashboard/live-sessions",
    icon: HiOutlineAcademicCap,
    end: false,
  },
];

const NavContent = ({ onClose }) => (
  <div className="p-4 space-y-2">
    {menuItems.map((item) => (
      <NavLink
        key={item.name}
        to={item.path}
        end={item.end}
        onClick={onClose} // Close sidebar on selection (mobile mainly)
        className={({ isActive }) =>
          `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "text-text-muted hover:bg-background hover:text-primary"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <item.icon className={`w-5 h-5 ${isActive ? "text-white" : ""}`} />
            <span className="font-medium">{item.name}</span>
          </>
        )}
      </NavLink>
    ))}
  </div>
);

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="w-64 bg-surface border-r border-border h-[calc(100vh-64px)] sticky top-16 hidden lg:block">
        <NavContent onClose={onClose} />
      </div>

      {/* Mobile Sidebar (Overlay) */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

        {/* Drawer */}
        <div
          className={`fixed top-0 left-0 w-64 h-full bg-surface shadow-xl transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Mobile Header (optional, maybe close button) */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <span className="heading-s font-bold text-primary">Menu</span>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-background text-text-muted"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <NavContent onClose={onClose} />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
