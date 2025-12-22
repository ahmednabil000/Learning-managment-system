import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LecturesService from "../services/LecturesService";

export const useLectures = (params) => {
  return useQuery({
    queryKey: ["lectures", params],
    queryFn: () => LecturesService.fetchLectures(params),
  });
};

export const useLecturesByCourse = (courseId) => {
  return useQuery({
    queryKey: ["lectures", "course", courseId],
    queryFn: () => LecturesService.fetchLecturesByCourse(courseId),
    enabled: !!courseId,
  });
};

export const useLecture = (id) => {
  return useQuery({
    queryKey: ["lecture", id],
    queryFn: () => LecturesService.fetchLectureById(id),
    enabled: !!id,
  });
};

export const useCreateLecture = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: LecturesService.createLecture,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
      queryClient.invalidateQueries({
        queryKey: ["course", variables.courseId],
      });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useUpdateLecture = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => LecturesService.updateLecture(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      const { id, data: payload } = variables;
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
      queryClient.invalidateQueries({ queryKey: ["lecture", id] });
      queryClient.invalidateQueries({ queryKey: ["course", payload.courseId] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useDeleteLecture = (courseId, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: LecturesService.deleteLecture,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
      if (courseId) {
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      }
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useAddLessonToLecture = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lectureId, lessonId }) =>
      LecturesService.addLessonToLecture(lectureId, lessonId),
    ...options,
    onSuccess: (data, variables, context) => {
      const { lectureId } = variables;
      queryClient.invalidateQueries({ queryKey: ["lecture", lectureId] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};
