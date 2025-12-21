import { Link } from "react-router-dom";
import Button from "../../../shared/components/Button";
import Card from "../../../shared/components/Card";
import { FaLaptopCode, FaDatabase } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const LearningTracks = () => {
  const { t } = useTranslation();
  const tracks = [
    {
      id: 1,
      title: t("tracks.items.web_dev.title"),
      description: t("tracks.items.web_dev.description"),
      icon: <FaLaptopCode className="h-8 w-8 text-white" />,
      color: "bg-secondary",
      courses: 12,
      duration: "6 months",
    },
    {
      id: 2,
      title: t("tracks.items.data_science.title"),
      description: t("tracks.items.data_science.description"),
      icon: <FaDatabase className="h-8 w-8 text-white" />,
      color: "bg-accent",
      courses: 10,
      duration: "5 months",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="heading-l text-primary mb-4">{t("tracks.title")}</h2>
          <p className="body text-text-muted max-w-2xl mx-auto">
            {t("tracks.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tracks.map((track) => (
            <Card
              key={track.id}
              className="flex flex-col md:flex-row items-center p-8 hover:shadow-lg transition-all border-l-4 border-l-primary/0 hover:border-l-primary"
            >
              <div
                className={`${track.color} p-4 rounded-full mb-6 md:mb-0 md:mr-8 rtl:md:mr-0 rtl:md:ml-8 shrink-0 shadow-md`}
              >
                {track.icon}
              </div>
              <div className="text-center md:text-left rtl:md:text-right grow">
                <h3 className="heading-m text-text-main mb-2">{track.title}</h3>
                <p className="body-sm text-text-muted mb-4">
                  {track.description}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start rtl:md:justify-end gap-4 mb-6">
                  <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {track.courses} {t("tracks.courses_count")}
                  </span>
                  <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {track.duration}
                  </span>
                </div>
                <Link to={`/tracks/${track.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full md:w-auto"
                  >
                    {t("tracks.view_track")}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningTracks;
