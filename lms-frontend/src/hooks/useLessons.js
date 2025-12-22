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

export const useCreateLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: LessonsService.createLesson,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["lessons", variables.lectureId],
      });
      queryClient.invalidateQueries({
        queryKey: ["lecture", variables.lectureId],
      });
    },
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => LessonsService.updateLesson(id, data),
    onSuccess: (_, { id, data }) => {
      queryClient.invalidateQueries({ queryKey: ["lesson", id] });
      queryClient.invalidateQueries({ queryKey: ["lessons", data.lectureId] });
      queryClient.invalidateQueries({ queryKey: ["lecture", data.lectureId] });
    },
  });
};

export const useDeleteLesson = (lectureId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: LessonsService.deleteLesson,
    onSuccess: () => {
      if (lectureId) {
        queryClient.invalidateQueries({ queryKey: ["lessons", lectureId] });
        queryClient.invalidateQueries({ queryKey: ["lecture", lectureId] });
      }
    },
  });
};
