import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CoursesService from "../services/CoursesService";

export const useCourses = (params) => {
  return useQuery({
    queryKey: ["courses", params],
    queryFn: () => CoursesService.fetchCourses(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useCourse = (id) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => CoursesService.fetchCourseById(id),
    enabled: !!id,
  });
};

export const useCreateCourse = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CoursesService.createCourse,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useUpdateCourse = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => CoursesService.updateCourse(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      const { id } = variables;
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", id] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useDeleteCourse = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CoursesService.deleteCourse,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};
