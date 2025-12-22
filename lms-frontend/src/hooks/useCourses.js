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

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CoursesService.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => CoursesService.updateCourse(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", id] });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CoursesService.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};
