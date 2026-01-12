import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { HiMenuAlt2 } from "react-icons/hi";
import ScrollToTop from "./ScrollToTop";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ScrollToTop />
      <Navbar />
      <div className="flex flex-1 relative">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {/* Mobile Sidebar Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors"
            >
              <HiMenuAlt2 className="w-6 h-6" />
              <span className="font-bold">Menu</span>
            </button>
          </div>
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
