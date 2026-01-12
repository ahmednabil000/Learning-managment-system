import { useState } from "react";
import { Link } from "react-router-dom";
import { useInstructorTracks, useDeleteTrack } from "../../hooks/useTracks";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import Button from "../../shared/components/Button";
import ConfirmModal from "../../shared/components/ConfirmModal";
import notification from "../../utils/notification";
import useAuthStore from "../../Stores/authStore";

const InstructorTracksPage = () => {
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageCount = 10;

  // Deletion Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    trackId: null,
    isLoading: false,
  });

  const { data, isLoading } = useInstructorTracks(user?._id || user?.id, {
    page,
    limit: pageCount,
    search,
  });
  const { mutate: deleteTrack, isPending: isDeleting } = useDeleteTrack();

  const tracks = data?.tracks || [];
  const totalPages = data?.totalPages || 1;

  const handleDelete = (id) => {
    setDeleteModal({
      isOpen: true,
      trackId: id,
      isLoading: false,
    });
  };

  const loops = [1, 2, 3, 4, 5];

  const confirmDelete = () => {
    setDeleteModal((prev) => ({ ...prev, isLoading: true }));
    deleteTrack(deleteModal.trackId, {
      onSuccess: () => {
        notification.success("Track deleted successfully!");
        setDeleteModal({ isOpen: false, trackId: null, isLoading: false });
      },
      onError: (error) => {
        notification.error(
          error?.response?.data?.message || "Failed to delete track."
        );
        setDeleteModal((prev) => ({ ...prev, isLoading: false }));
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="heading-l text-text-main">Tracks</h1>
          <p className="text-text-muted mt-1">Manage your learning tracks</p>
        </div>
        <Link to="/dashboard/tracks/new">
          <Button variant="primary" className="flex items-center gap-2">
            <FaPlus /> Create New Track
          </Button>
        </Link>
      </div>

      <div className="bg-surface p-4 rounded-2xl border border-border flex items-center gap-3">
        <FaSearch className="text-text-muted" />
        <input
          type="text"
          placeholder="Search your tracks..."
          className="bg-transparent border-none focus:ring-0 flex-1 text-text-main py-2 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 border-b border-border">
                <th className="px-6 py-4 font-bold text-text-main">Track</th>
                <th className="px-6 py-4 font-bold text-text-main text-center">
                  Courses
                </th>
                <th className="px-6 py-4 font-bold text-text-main text-center">
                  Status
                </th>
                <th className="px-6 py-4 font-bold text-text-main text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                loops.map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-border rounded w-48"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-border rounded w-12 mx-auto"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-border rounded w-12 mx-auto"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-8 bg-border rounded w-24 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : tracks.length > 0 ? (
                tracks.map((track) => (
                  <tr
                    key={track._id}
                    className="hover:bg-background/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {track.thumbnail && (
                          <img
                            src={track.thumbnail}
                            alt={track.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-bold text-text-main">
                            {track.title}
                          </p>
                          <p className="text-xs text-text-muted truncate max-w-xs">
                            {track.description}
                          </p>
                          {track.discount > 0 && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-error/10 text-error text-[10px] font-bold uppercase rounded-sm border border-error/20">
                              Discount {track.discount}%
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-text-main">
                      {track.courses?.length || 0}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          track.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {track.isActive ? "Active" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/dashboard/tracks/${track._id}/edit`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-info hover:bg-info/10"
                            title="Edit Track"
                          >
                            <FaEdit />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-error hover:bg-error/10"
                          onClick={() => handleDelete(track._id)}
                          title="Delete Track"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-text-muted"
                  >
                    No tracks found. Create your first track!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? "primary" : "outline"}
              size="sm"
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Track"
        message="Are you sure you want to delete this track? All associated data will be permanently removed."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        isLoading={deleteModal.isLoading || isDeleting}
      />
    </div>
  );
};

export default InstructorTracksPage;
