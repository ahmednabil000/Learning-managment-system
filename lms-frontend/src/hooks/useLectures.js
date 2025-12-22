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

export const useCreateLecture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: LecturesService.createLecture,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
      queryClient.invalidateQueries({
        queryKey: ["course", variables.courseId],
      });
    },
  });
};

export const useUpdateLecture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => LecturesService.updateLecture(id, data),
    onSuccess: (_, { id, data }) => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
      queryClient.invalidateQueries({ queryKey: ["lecture", id] });
      queryClient.invalidateQueries({ queryKey: ["course", data.courseId] });
    },
  });
};

export const useDeleteLecture = (courseId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: LecturesService.deleteLecture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
      if (courseId) {
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      }
    },
  });
};

export const useAddLessonToLecture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lectureId, lessonId }) =>
      LecturesService.addLessonToLecture(lectureId, lessonId),
    onSuccess: (_, { lectureId }) => {
      queryClient.invalidateQueries({ queryKey: ["lecture", lectureId] });
    },
  });
};
