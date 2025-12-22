import { useTranslation } from "react-i18next";
import useAuthStore from "../../Stores/authStore";

const InstructorDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="heading-l text-text-main">
          {t("dashboard.welcome", { name: user?.name || "Instructor" })}
          👋
        </h1>
        <p className="text-text-muted mt-2">
          Here's what's happening with your courses today.
        </p>
      </header>

      {/* Placeholder Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Students", value: "1,234", change: "+12%" },
          { label: "Course Rating", value: "4.8", change: "0.2" },
          { label: "Total Revenue", value: "$12,450", change: "+8%" },
          { label: "Active Courses", value: "12", change: "+2" },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="bg-surface p-6 rounded-2xl border border-border shadow-sm"
          >
            <p className="text-sm font-medium text-text-muted">{stat.label}</p>
            <div className="flex items-baseline mt-2 gap-2">
              <p className="text-2xl font-bold text-text-main">{stat.value}</p>
              <span className="text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Content Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface p-6 rounded-2xl border border-border min-h-[300px]">
          <h2 className="text-lg font-bold text-text-main mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 p-4 rounded-xl border border-border border-dashed"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-main truncate w-full max-w-xs">
                    New student enrolled in "Advanced React Hooks"
                  </p>
                  <p className="text-xs text-text-muted mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-border min-h-[300px]">
          <h2 className="text-lg font-bold text-text-main mb-4">
            Your Courses Performance
          </h2>
          <div className="flex items-center justify-center h-full text-text-muted">
            Analytics chart will be here
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
