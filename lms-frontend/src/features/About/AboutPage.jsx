import React from "react";
import {
  FaGraduationCap,
  FaChalkboardTeacher,
  FaUsers,
  FaGlobe,
} from "react-icons/fa";

const AboutPage = () => {
  // const { t } = useTranslation();

  const stats = [
    {
      icon: <FaUsers className="w-8 h-8 text-primary" />,
      value: "10k+",
      label: "Students",
    },
    {
      icon: <FaChalkboardTeacher className="w-8 h-8 text-primary" />,
      value: "200+",
      label: "Expert Instructors",
    },
    {
      icon: <FaGraduationCap className="w-8 h-8 text-primary" />,
      value: "500+",
      label: "Courses",
    },
    {
      icon: <FaGlobe className="w-8 h-8 text-primary" />,
      value: "50+",
      label: "Countries",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="heading-xl font-extrabold text-3xl mb-6">About Us</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Empowering learners worldwide with accessible, high-quality
            education. We bridge the gap between ambition and achievement.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 lg:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="heading-l text-primary">Our Mission</h2>
              <p className="text-lg text-text-muted leading-relaxed">
                At our Learning Management System, we believe that education is
                the key to unlocking human potential. Our mission is to provide
                a platform where anyone, anywhere, can access world-class
                learning resources and connect with expert instructors.
              </p>
              <p className="text-lg text-text-muted leading-relaxed">
                We are dedicated to creating an engaging, inclusive, and
                effective learning environment that adapts to the needs of
                modern students and professionals.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl bg-gray-100 relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
                  alt="Team collaboration"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full bg-accent/20 rounded-3xl z-0"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-surface p-8 rounded-2xl shadow-sm border border-border text-center hover:-translate-y-1 transition-transform cursor-default"
              >
                <div className="flex justify-center mb-4 bg-primary/10 w-16 h-16 rounded-full items-center mx-auto">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-text-main mb-2">
                  {stat.value}
                </h3>
                <p className="text-text-muted font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 lg:py-24 bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-l text-primary mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-6 text-accent">
                <FaGraduationCap size={24} />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-3">
                Expert-Led Courses
              </h3>
              <p className="text-text-muted">
                Learn from industry professionals and academic experts who are
                passionate about teaching.
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-6 text-success">
                <FaChalkboardTeacher size={24} />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-3">
                Interactive Learning
              </h3>
              <p className="text-text-muted">
                Engage with quizzes, assignments, and live sessions to reinforce
                your understanding.
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mx-auto mb-6 text-warning">
                <FaUsers size={24} />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-3">
                Community Support
              </h3>
              <p className="text-text-muted">
                Join a vibrant community of learners to share knowledge, ask
                questions, and grow together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
