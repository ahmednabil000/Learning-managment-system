import { NavLink } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
  HiOutlineUsers,
  HiOutlineChartBar,
  HiOutlineCog,
} from "react-icons/hi";
import { FaClipboardList } from "react-icons/fa";

const Sidebar = () => {
  const menuItems = [
    { name: "Overview", path: "/dashboard", icon: HiOutlineHome, end: true },
    {
      name: "My Courses",
      path: "/dashboard/courses",
      icon: HiOutlineBookOpen,
      end: false,
    },
    {
      name: "Students",
      path: "/dashboard/students",
      icon: HiOutlineUsers,
      end: false,
    },
    {
      name: "Analytics",
      path: "/dashboard/analytics",
      icon: HiOutlineChartBar,
      end: false,
    },
    {
      name: "Live Sessions",
      path: "/dashboard/live-sessions",
      icon: HiOutlineAcademicCap,
      end: false,
    },
  
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: HiOutlineCog,
      end: false,
    },
  ];

  return (
    <div className="w-64 bg-surface border-r border-border h-[calc(100vh-64px)] sticky top-16 hidden lg:block">
      <div className="p-4 space-y-2">
        {menuItems.map((item) => {
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
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
                  <item.icon
                    className={`w-5 h-5 ${isActive ? "text-white" : ""}`}
                  />
                  <span className="font-medium">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
