import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LessonsService from "../services/LessonsService";

export const useLesson = (id) => {
  return useQuery({
    queryKey: ["lesson", id],
    queryFn: () => LessonsService.fetchLessonById(id),
    enabled: !!id,
  });
};

export const useLessonsByLecture = (lectureId) => {
  return useQuery({
    queryKey: ["lessons", lectureId],
    queryFn: () => LessonsService.fetchLessonsByLecture(lectureId),
    enabled: !!lectureId,
  });
};

export const useCreateLesson = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: LessonsService.createLesson,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["lessons", variables.lectureId],
      });
      queryClient.invalidateQueries({
        queryKey: ["lecture", variables.lectureId],
      });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useUpdateLesson = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => LessonsService.updateLesson(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      const { id, data: payload } = variables;
      queryClient.invalidateQueries({ queryKey: ["lesson", id] });
      queryClient.invalidateQueries({
        queryKey: ["lessons", payload.lectureId],
      });
      queryClient.invalidateQueries({
        queryKey: ["lecture", payload.lectureId],
      });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useDeleteLesson = (lectureId, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: LessonsService.deleteLesson,
    ...options,
    onSuccess: (data, variables, context) => {
      if (lectureId) {
        queryClient.invalidateQueries({ queryKey: ["lessons", lectureId] });
        queryClient.invalidateQueries({ queryKey: ["lecture", lectureId] });
      }
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};
