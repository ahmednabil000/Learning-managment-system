import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ExamsService from "../services/ExamsService";

export const useCreateExam = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ExamsService.createExam,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["available-exam", variables.course]);
      queryClient.invalidateQueries(["exams-by-course", variables.course]);
      if (options.onSuccess) options.onSuccess(data);
    },
    onError: options.onError,
  });
};

export const useDeleteExam = (courseId, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ExamsService.deleteExam,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["available-exam", courseId]);
      queryClient.invalidateQueries(["exams-by-course", courseId]);
      if (options.onSuccess) options.onSuccess(data);
    },
    onError: options.onError,
  });
};

export const useAddQuestion = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ examId, data }) => ExamsService.addQuestion(examId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["available-exam"]);
      if (options.onSuccess) options.onSuccess(data);
    },
    onError: options.onError,
  });
};

export const useRemoveQuestion = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ examId, questionId }) =>
      ExamsService.removeQuestion(examId, questionId),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["available-exam"]);
      if (options.onSuccess) options.onSuccess(data);
    },
    onError: options.onError,
  });
};

export const useCourseAvailableExam = (courseId, options = {}) => {
  return useQuery({
    queryKey: ["available-exam", courseId],
    queryFn: () => ExamsService.getCourseAvailableExam(courseId),
    enabled: !!courseId,
    retry: false,
    ...options,
  });
};

export const useExamsByCourse = (courseId, options = {}) => {
  return useQuery({
    queryKey: ["exams-by-course", courseId],
    queryFn: () => ExamsService.getExamsByCourse(courseId),
    enabled: !!courseId,
    retry: false,
    ...options,
  });
};

export const useExamDuration = (examId, enabled = true) => {
  return useQuery({
    queryKey: ["exam-duration", examId],
    queryFn: () => ExamsService.getExamDuration(examId),
    enabled: !!examId && enabled,
    retry: false,
  });
};

export const useStartAttempt = (options = {}) => {
  return useMutation({
    mutationFn: ({ examId, data }) => ExamsService.startAttempt(examId, data),
    onSuccess: options.onSuccess,
    onError: options.onError,
  });
};

export const useSubmitAnswer = (options = {}) => {
  return useMutation({
    mutationFn: ({ attemptId, data }) =>
      ExamsService.submitAnswer(attemptId, data),
    onSuccess: options.onSuccess,
    onError: options.onError,
  });
};

export const useEndAttempt = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ExamsService.endAttempt,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["exam-attempt"]);
      queryClient.invalidateQueries(["available-exam"]);
      if (options.onSuccess) options.onSuccess(data);
    },
    onError: options.onError,
  });
};

export const useGetAttempt = (attemptId, enabled = true) => {
  return useQuery({
    queryKey: ["exam-attempt", attemptId],
    queryFn: () => ExamsService.getAttempt(attemptId),
    enabled: !!attemptId && enabled,
  });
};
