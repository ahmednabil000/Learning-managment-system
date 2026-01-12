import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CoursesService from "../services/CoursesService";

export const useCourses = (params) => {
  return useQuery({
    queryKey: ["courses", params],
    queryFn: () => CoursesService.fetchCourses(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useEnrolledCourses = (params) => {
  return useQuery({
    queryKey: ["enrolled-courses", params],
    queryFn: () => CoursesService.fetchEnrolledCourses(params),
    keepPreviousData: true,
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

export const useInstructorCourses = (instructorId, params = {}) => {
  return useQuery({
    queryKey: ["instructor-courses", instructorId, params],
    queryFn: () => CoursesService.fetchInstructorCourses(instructorId, params),
    enabled: !!instructorId,
  });
};

export const useAddLearningItem = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => CoursesService.addLearningItem(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["course", variables.id] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useRemoveLearningItem = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, index }) => CoursesService.removeLearningItem(id, index),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["course", variables.id] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useUpdateLearningItem = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, index, data }) =>
      CoursesService.updateLearningItem(id, index, data),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["course", variables.id] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useAddRequirement = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => CoursesService.addRequirement(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["course", variables.id] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useRemoveRequirement = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, index }) => CoursesService.removeRequirement(id, index),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["course", variables.id] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useUpdateRequirement = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, index, data }) =>
      CoursesService.updateRequirement(id, index, data),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["course", variables.id] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useTopCourses = (limit = 10) => {
  return useQuery({
    queryKey: ["top-courses", limit],
    queryFn: () => CoursesService.fetchTopCourses(limit),
  });
};
