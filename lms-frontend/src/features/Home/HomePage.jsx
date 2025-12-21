import React from "react";
import HeroSection from "./components/Hero";
import FeaturesSection from "./components/FeaturesSection";
import PopularCourses from "./components/PopularCourses";
import LearningTracks from "./components/LearningTracks";
import StatsSection from "./components/StatsSection";
import CTASection from "./components/CTASection";

function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <PopularCourses />
      <LearningTracks />
      <StatsSection />
      <CTASection />
    </div>
  );
}

export default HomePage;
