import { Link } from "react-router-dom";
import Button from "../../../shared/components/Button";
import Card from "../../../shared/components/Card";
import { useTranslation } from "react-i18next";
import { useTopTracks } from "../../../hooks/useTracks";

const LearningTracks = () => {
  const { t } = useTranslation();
  const { data: tracks, isLoading } = useTopTracks(2);

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="heading-l text-primary mb-4">{t("tracks.title")}</h2>
          <p className="body text-text-muted max-w-2xl mx-auto">
            {t("tracks.subtitle")}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tracks?.map((track) => (
                <Card
                  key={track._id}
                  className="flex flex-col md:flex-row items-center p-6 hover:shadow-lg transition-all border-l-4 border-l-primary/0 hover:border-l-primary group bg-surface border-border"
                >
                  <div className="w-full md:w-32 h-32 md:h-24 mb-6 md:mb-0 md:mr-6 rtl:md:mr-0 rtl:md:ml-6 shrink-0 rounded-xl overflow-hidden shadow-sm relative border border-border">
                    <img
                      src={
                        track.thumbnail ||
                        "https://placehold.co/150x150?text=Track"
                      }
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="text-center md:text-left rtl:md:text-right grow w-full">
                    <h3 className="heading-m text-text-main mb-2 line-clamp-1">
                      {track.title}
                    </h3>
                    <p className="body-sm text-text-muted mb-4 line-clamp-2">
                      {track.description}
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start rtl:md:justify-end gap-3 mb-4">
                      <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full whitespace-nowrap">
                        {track.courses?.length || 0} {t("tracks.courses_count")}
                      </span>
                      {track.discount > 0 && (
                        <span className="text-xs font-bold bg-error/10 text-error px-3 py-1 rounded-full whitespace-nowrap">
                          {track.discount}% OFF
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/tracks/${track._id}`}
                      className="block w-full md:w-auto"
                    >
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

            <div className="text-center mt-12">
              <Link to="/tracks">
                <Button variant="primary" size="lg">
                  View All Tracks
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default LearningTracks;
