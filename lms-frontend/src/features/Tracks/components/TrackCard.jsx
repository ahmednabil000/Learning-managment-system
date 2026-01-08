import { Link } from "react-router-dom";
import { FaUser, FaBookOpen } from "react-icons/fa";

const TrackCard = ({ track }) => {
  return (
    <div className="group bg-surface border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col h-full">
      {/* Thumbnail */}
      <Link
        to={`/tracks/${track._id}`}
        className="block relative overflow-hidden aspect-video"
      >
        <img
          src={track.thumbnail || "https://placehold.co/600x400?text=No+Image"} // Fallback image
          alt={track.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {track.discount > 0 && (
          <div className="absolute top-3 left-3 bg-error text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            {track.discount}% OFF
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Link to={`/tracks/${track._id}`}>
          <h3 className="heading-s text-text-main mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {track.title}
          </h3>
        </Link>

        <p className="text-sm text-text-muted mb-4 line-clamp-2">
          {track.description}
        </p>

        <div className="mt-auto space-y-4">
          {/* Instructor */}
          <div className="flex items-center gap-2">
            <img
              src={track.user?.imageUrl || "https://placehold.co/40x40"}
              alt={track.user?.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs text-text-muted font-medium">
              {track.user?.name}
            </span>
          </div>

          <div className="border-t border-border pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-text-muted text-xs">
              <FaBookOpen />
              <span>{track.courses?.length || 0} Courses</span>
            </div>

            <div className="text-right">
              {/* 
                        Pricing logic for tracks is usually calculated based on courses. 
                        Since the API returns track details, we assume the display logic 
                        might need to fetch price or just show "View Details".
                        For now, let's keep it simple or show 'View for Info'
                     */}
              <Link to={`/tracks/${track._id}`}>
                <span className="text-sm font-bold text-primary hover:underline">
                  View Details
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
