import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CourseBlogService from "../../../services/CourseBlogService";
import { FaBook, FaCalendarAlt, FaChevronRight } from "react-icons/fa";

const CourseBlogSection = ({ courseId }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        // Assuming the API supports filtering by courseId
        // If not, we might need to filter client-side or adjust API call
        const response = await CourseBlogService.getAllBlogs(courseId);
        // Response structure: check documentation. GET / returns array or paginated object?
        // Documentation says:
        // [
        //   { "_id": "...", "title": "...", "createdAt": "...", "thumbnail": "..." }
        // ]
        // But also mentions pagination params. If response is array, direct usage.
        // If paginated, might be response.data or response.docs?
        // Documentation Example Response (Success - 200):
        // [ { ... } ]
        // This likely means it returns an array directly if standard params aren't complex,
        // or I should handle both.
        // Let's assume it returns an array for now based on the example.

        // Wait, other endpoints like Get All Courses return { shortCourses: [], page: 1 ... }
        // The blog docs showed an array in the example block. I will safely handle both.

        let fetchedBlogs = [];
        if (Array.isArray(response)) {
          fetchedBlogs = response;
        } else if (response.data && Array.isArray(response.data)) {
          fetchedBlogs = response.data;
        } else if (response.blogs && Array.isArray(response.blogs)) {
          fetchedBlogs = response.blogs;
        }

        setBlogs(fetchedBlogs);
      } catch (err) {
        console.error("Error fetching course blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchBlogs();
    }
  }, [courseId]);

  if (loading)
    return (
      <div className="mt-12 bg-surface border border-border rounded-3xl p-8 mb-8 shadow-sm">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );

  // if (error) return null; // Let's show empty state if error for now, or simply handle it.

  return (
    <div className="mt-12 bg-surface border border-border rounded-3xl p-8 mb-8 shadow-sm">
      <h2 className="heading-l text-primary mb-6 flex items-center gap-3">
        <div className="w-2 h-8 bg-accent rounded-full"></div>
        Course Blogs
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {blogs.length === 0 ? (
          <div className="col-span-full text-center py-8 text-text-muted">
            <p>No blogs posted for this course yet.</p>
          </div>
        ) : (
          blogs.map((blog) => (
            <Link
              key={blog._id}
              to={`/blogs/${blog._id}`}
              className="group flex flex-col p-4 border border-border rounded-xl hover:border-primary/50 transition-all hover:bg-background/50"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-lg text-text-main group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <FaChevronRight className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
              </div>

              <div className="flex items-center gap-2 text-sm text-text-muted mt-auto">
                <FaCalendarAlt size={12} />
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseBlogSection;
