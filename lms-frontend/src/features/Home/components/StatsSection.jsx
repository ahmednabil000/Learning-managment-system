import { useTranslation } from "react-i18next";

const StatsSection = () => {
  const { t } = useTranslation();
  const stats = [
    { label: t("stats.students"), value: "15,000+" },
    { label: t("stats.courses"), value: "250+" },
    { label: t("stats.instructors"), value: "80+" },
    { label: t("stats.satisfaction"), value: "4.9/5" },
  ];

  return (
    <section className="py-16 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20 rtl:divide-x-reverse">
          {stats.map((stat, index) => (
            <div key={index} className="px-4">
              <div className="heading-xl font-bold mb-2">{stat.value}</div>
              <div className="text-white/80 body font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
