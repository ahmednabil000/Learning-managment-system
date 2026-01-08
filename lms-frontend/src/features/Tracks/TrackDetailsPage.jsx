import { useParams, Link, useNavigate } from "react-router-dom";
import { useTrack } from "../../hooks/useTracks";
import { useTranslation } from "react-i18next";
import {
  FaChevronLeft,
  FaBookOpen,
  FaCheckCircle,
  FaUser,
} from "react-icons/fa";
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
      <div className="bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <Link
                to="/tracks"
                className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-4"
              >
                <FaChevronLeft
                  className={`${
                    isRtl ? "rotate-180" : ""
                  } mr-2 rtl:ml-2 rtl:mr-0`}
                />
                Back to Tracks
              </Link>

              <h1 className="heading-xl font-extrabold tracking-tight">
                {track.title}
              </h1>
              <p className="text-lg text-white/90 leading-relaxed max-w-2xl">
                {track.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 mt-8">
                <div className="flex items-center gap-3 bg-white/10 p-2 rounded-lg">
                  {/* Instructor info is in track.user */}
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
                    <img
                      src={track.user?.imageUrl || "https://placehold.co/40x40"}
                      alt={track.user?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Created by</p>
                    <p className="font-semibold">{track.user?.name}</p>
                  </div>
                </div>
                <div className="h-10 w-px bg-white/20 hidden md:block"></div>
                <div className="flex items-center gap-2">
                  <FaBookOpen className="text-white/60" />
                  <span>{track.courses?.length || 0} Courses</span>
                </div>
              </div>
            </div>

            {/* Track Info Card */}
            <div className="lg:col-span-1">
              <div className="bg-surface rounded-3xl shadow-2xl overflow-hidden text-text-main border border-border/50 sticky top-24">
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
                <div className="p-8">
                  {/* Actions/Price */}
                  {track.discount > 0 && (
                    <div className="mb-4">
                      <span className="bg-error/10 text-error text-sm font-bold px-2 py-1 rounded border border-error/20">
                        {track.discount}% OFF Bundle
                      </span>
                    </div>
                  )}
                  <p className="text-text-muted text-sm mb-6">
                    Get all these courses together to master this path.
                  </p>

                  {track.totalPrice !== undefined && (
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-primary">
                        ${track.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <Button
                    className="w-full justify-center"
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
            <div className="space-y-6">
              {(track.courses || []).map((course, index) => (
                <div
                  key={course._id}
                  className="flex gap-4 p-4 bg-surface border border-border rounded-xl"
                >
                  <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <Link to={`/courses/${course._id}`} className="block group">
                      <h3 className="heading-s text-text-main group-hover:text-primary transition-colors mb-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-text-muted line-clamp-2">
                        {course.description}
                      </p>
                    </Link>
                  </div>
                  <div className="shrink-0">
                    <Link to={`/courses/${course._id}`}>
                      <Button variant="outline" size="sm">
                        View Course
                      </Button>
                    </Link>
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
