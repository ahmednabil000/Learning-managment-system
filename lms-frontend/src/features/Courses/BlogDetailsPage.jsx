import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import CourseBlogService from "../../services/CourseBlogService";
import { FaArrowLeft, FaCalendar, FaUser, FaLock } from "react-icons/fa";
import Button from "../../shared/components/Button";

const BlogDetailsPage = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const data = await CourseBlogService.getBlogById(blogId);
        setBlog(data);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError(err); // Store full error to check status
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    // Check for 401 Unauthorized (Mapped to Access Denied per requirements)
    if (error.response?.status === 401) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
          <FaLock size={64} className="text-text-muted mb-4" />
          <h2 className="heading-l text-text-main mb-2">Access Denied</h2>
          <p className="text-text-secondary mb-6">
            You must be enrolled in this course to view this blog.
          </p>
          <div className="flex gap-4">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Go Back
            </Button>
            <Link to="/courses">
              <Button variant="primary">Back to Courses</Button>
            </Link>
          </div>
        </div>
      );
    }

    // Default Error State
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h2 className="heading-l text-error mb-4">
          {error.response?.data?.message || "Blog not found"}
        </h2>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-text-muted hover:text-primary transition-colors mb-8"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>

        <article className="bg-surface rounded-3xl shadow-lg border border-border overflow-hidden">
          {blog.thumbnail && (
            <div className="w-full h-64 md:h-96 relative">
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          )}

          <div className="p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-6 text-sm text-text-muted mb-6">
              <span className="flex items-center gap-2 bg-background/50 px-3 py-1 rounded-full">
                <FaCalendar className="text-primary" />
                {new Date(blog.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {blog.user && (
                <span className="flex items-center gap-2 bg-background/50 px-3 py-1 rounded-full">
                  <FaUser className="text-primary" />
                  {blog.user.name || "Instructor"}
                </span>
              )}
            </div>

            <h1 className="heading-xl text-text-main mb-8 leading-tight">
              {blog.title}
            </h1>

            <div className="prose prose-lg dark:prose-invert max-w-none text-text-secondary leading-relaxed whitespace-pre-wrap">
              {/* Displaying content as text mostly, or html if trusted */}
              {blog.content}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
