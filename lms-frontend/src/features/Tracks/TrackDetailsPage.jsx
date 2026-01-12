import { useParams, Link, useNavigate } from "react-router-dom";
import { useTrack } from "../../hooks/useTracks";
import { useTranslation } from "react-i18next";
import { FaChevronLeft, FaBookOpen, FaCheckCircle } from "react-icons/fa";
import Button from "../../shared/components/Button";

const TrackDetailsPage = () => {
  const { trackId } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const handleEnroll = () => {
    if (!trackId) return;
    navigate(`/checkout/track/${trackId}`);
  };

  // We use useTrack hook here
  const { data: track, isLoading, isError } = useTrack(trackId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !track) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h2 className="heading-l text-error mb-4">Error loading track</h2>
        <Link to="/tracks">
          <Button variant="primary">Back to Tracks</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="bg-primary text-white relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-3">
              <Link
                to="/tracks"
                className="inline-flex items-center text-white/70 hover:text-white transition-colors text-xs font-medium mb-0.5"
              >
                <FaChevronLeft
                  className={`${
                    isRtl ? "rotate-180" : ""
                  } mr-1 rtl:ml-1 rtl:mr-0`}
                />
                Back to Tracks
              </Link>

              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight">
                {track.title}
              </h1>
              <p className="text-sm lg:text-base text-white/90 leading-relaxed max-w-2xl line-clamp-2">
                {track.description}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs font-medium">
                <div className="flex items-center gap-2 bg-white/10 py-1 px-2 rounded-lg">
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-white/30">
                    <img
                      src={track.user?.imageUrl || "https://placehold.co/40x40"}
                      alt={track.user?.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <span className="text-white/60 mr-1">Created by</span>
                    <span className="font-semibold text-white/90">
                      {track.user?.name}
                    </span>
                  </div>
                </div>

                <div className="h-3 w-px bg-white/20 hidden md:block"></div>

                <div className="flex items-center gap-1.5 text-white/80">
                  <FaBookOpen size={12} />
                  <span>{track.courses?.length || 0} Courses</span>
                </div>
              </div>
            </div>

            {/* Track Info Card */}
            <div className="lg:col-span-1 flex justify-center lg:justify-end">
              <div className="bg-surface rounded-xl shadow-xl overflow-hidden text-text-main border border-border/50 sticky top-24 w-full max-w-sm">
                <div className="aspect-video relative overflow-hidden group">
                  <img
                    src={
                      track.thumbnail ||
                      "https://placehold.co/600x400?text=No+Image"
                    }
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  {/* Actions/Price */}
                  {track.discount > 0 && (
                    <div className="mb-2">
                      <span className="bg-error/10 text-error text-xs font-bold px-2 py-0.5 rounded border border-error/20">
                        {track.discount}% OFF Bundle
                      </span>
                    </div>
                  )}
                  <p className="text-text-muted text-xs mb-4 line-clamp-2">
                    Get all these courses together to master this path.
                  </p>

                  {track.totalPrice !== undefined && (
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-primary">
                        ${track.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <Button
                    className="w-full justify-center py-3 text-base font-bold"
                    onClick={handleEnroll}
                  >
                    Enroll Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="heading-l text-primary mb-8 flex items-center gap-3">
              <div className="w-2 h-8 bg-accent rounded-full"></div>
              Curriculum
            </h2>

            {/* List of Courses in Track */}
            <div className="space-y-4">
              {(track.courses || []).map((course, index) => (
                <div
                  key={course._id}
                  className="bg-surface border border-border rounded-2xl p-4 flex gap-4 transition-all hover:border-primary/30 hover:shadow-sm group"
                >
                  {/* Number */}
                  <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm self-center">
                    {index + 1}
                  </div>

                  {/* Thumbnail */}
                  <div className="shrink-0 w-32 h-20 rounded-lg overflow-hidden bg-gray-100 hidden sm:block">
                    <img
                      src={course.imageUrl || "https://placehold.co/600x400"}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <Link to={`/courses/${course._id}`}>
                          <h3 className="text-lg font-bold text-text-main hover:text-primary transition-colors mb-1 truncate">
                            {course.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-text-muted line-clamp-2 mb-2">
                          {course.description}
                        </p>
                      </div>
                      {/* View Button */}
                      <Link
                        to={`/courses/${course._id}`}
                        className="shrink-0 max-sm:hidden"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-primary/5"
                        >
                          View
                        </Button>
                      </Link>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-3 text-xs font-medium">
                      {course.level && (
                        <span className="px-2 py-0.5 rounded bg-surface border border-border text-text-secondary uppercase tracking-wide">
                          {course.level}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            {/* Additional Sidebar Info if needed */}
            <div className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
              <h3 className="heading-m text-primary mb-4">What's Included</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-text-muted">
                  <FaCheckCircle className="text-success mt-1 shrink-0" />
                  <span>Lifetime access to all courses</span>
                </li>

                <li className="flex items-start gap-3 text-text-muted">
                  <FaCheckCircle className="text-success mt-1 shrink-0" />
                  <span>Access on mobile and desktop</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackDetailsPage;
