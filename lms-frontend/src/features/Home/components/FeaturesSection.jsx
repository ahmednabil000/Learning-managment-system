import Card from "../../../shared/components/Card";
import { FaLaptopCode, FaChartLine, FaPalette, FaBrain } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const FeaturesSection = () => {
  const { t } = useTranslation();
  const features = [
    {
      icon: <FaLaptopCode className="h-8 w-8 text-secondary" />,
      title: t("features.items.instructors.title"),
      description: t("features.items.instructors.description"),
    },
    {
      icon: <FaChartLine className="h-8 w-8 text-accent" />,
      title: t("features.items.career.title"),
      description: t("features.items.career.description"),
    },
    {
      icon: <FaPalette className="h-8 w-8 text-primary" />,
      title: t("features.items.interactive.title"),
      description: t("features.items.interactive.description"),
    },
    {
      icon: <FaBrain className="h-8 w-8 text-success" />,
      title: t("features.items.schedule.title"),
      description: t("features.items.schedule.description"),
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="heading-l text-primary mb-4">{t("features.title")}</h2>
          <p className="body text-text-muted max-w-2xl mx-auto">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="flex flex-col items-center text-center h-full hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="mb-6 p-4 bg-surface rounded-full shadow-sm">
                {feature.icon}
              </div>
              <h3 className="heading-m text-text-main mb-3">{feature.title}</h3>
              <p className="body-sm text-text-muted">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
