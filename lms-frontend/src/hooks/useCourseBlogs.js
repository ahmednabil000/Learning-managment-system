import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CourseBlogService from "../services/CourseBlogService";

export const useCourseBlogs = (courseId, params = {}) => {
  return useQuery({
    queryKey: ["courseBlogs", courseId, params],
    queryFn: () => CourseBlogService.getAllBlogs(courseId, params),
    enabled: !!courseId,
  });
};

export const useCreateBlog = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CourseBlogService.createBlog,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["courseBlogs", variables.course]); // Invalidate course blogs
      // Also invalidate lectures/course if we are embedding it?
      // Assuming blogs are fetched separately for now.
      if (options.onSuccess) options.onSuccess(data, variables);
    },
    onError: options.onError,
  });
};

export const useBlog = (blogId) => {
  return useQuery({
    queryKey: ["blog", blogId],
    queryFn: () => CourseBlogService.getBlogById(blogId),
    enabled: !!blogId,
  });
};

export const useUpdateBlog = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => CourseBlogService.updateBlog(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["blog", variables.id]);
      queryClient.invalidateQueries(["courseBlogs"]);
      if (options.onSuccess) options.onSuccess(data, variables);
    },
    onError: options.onError,
  });
};

export const useDeleteBlog = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CourseBlogService.deleteBlog,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["courseBlogs"]);
      if (options.onSuccess) options.onSuccess(data, variables);
    },
    onError: options.onError,
  });
};
