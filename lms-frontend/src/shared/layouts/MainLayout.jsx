import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "./ScrollToTop";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-text-main">
      <ScrollToTop />
      <Navbar />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
