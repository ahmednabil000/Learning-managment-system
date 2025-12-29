import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AssignmentsService from "../services/AssignmentsService";
import { toast } from "react-toastify";

// --- Assignments Hooks ---

export const useAssignmentsByCourse = (courseId) => {
  return useQuery({
    queryKey: ["assignments", "course", courseId],
    queryFn: async () => {
      const data = await AssignmentsService.getAssignmentsByCourse(courseId, {
        pageCount: 100,
      });
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.assignments)) return data.assignments;
      if (data && Array.isArray(data.data)) return data.data;
      return [];
    },
    enabled: !!courseId,
  });
};

export const useAssignmentsByLecture = (lectureId) => {
  return useQuery({
    queryKey: ["assignments", "lecture", lectureId],
    queryFn: async () => {
      const data = await AssignmentsService.getAssignmentsByLecture(lectureId);
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.assignments)) return data.assignments;
      if (data && Array.isArray(data.data)) return data.data;
      return [];
    },
    enabled: !!lectureId,
  });
};

export const useAssignment = (assignmentId) => {
  return useQuery({
    queryKey: ["assignment", assignmentId],
    queryFn: () => AssignmentsService.getAssignmentById(assignmentId),
    enabled: !!assignmentId,
  });
};

export const useCreateAssignment = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AssignmentsService.createAssignment,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["assignments"]);
      if (options.onSuccess) options.onSuccess(data);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
      else toast.error("Failed to create assignment");
    },
  });
};

export const useUpdateAssignment = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => AssignmentsService.updateAssignment(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["assignments"]);
      queryClient.invalidateQueries(["assignment", data._id]);
      if (options.onSuccess) options.onSuccess(data);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
      else toast.error("Failed to update assignment");
    },
  });
};

export const useDeleteAssignment = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AssignmentsService.deleteAssignment,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(["assignments"]);
      if (options.onSuccess) options.onSuccess(id);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
      else toast.error("Failed to delete assignment");
    },
  });
};

// --- Question Hooks ---

export const useQuestionsByAssignment = (assignmentId) => {
  return useQuery({
    queryKey: ["questions", "assignment", assignmentId],
    queryFn: async () => {
      const data = await AssignmentsService.getQuestionsByAssignment(
        assignmentId
      );
      // Handle potential pagination structure
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.questions)) return data.questions;
      if (data && Array.isArray(data.data)) return data.data;
      return [];
    },
    enabled: !!assignmentId,
  });
};

export const useCreateQuestion = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AssignmentsService.createQuestion,
    onSuccess: (data) => {
      // Assuming questions are fetched with assignment details
      if (data.assignment) {
        queryClient.invalidateQueries(["assignment", data.assignment]);
      }
      if (options.onSuccess) options.onSuccess(data);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
      else toast.error("Failed to create question");
    },
  });
};

export const useUpdateQuestion = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => AssignmentsService.updateQuestion(id, data),
    onSuccess: (data) => {
      if (data.assignment) {
        queryClient.invalidateQueries(["assignment", data.assignment]);
      }
      if (options.onSuccess) options.onSuccess(data);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
      else toast.error("Failed to update question");
    },
  });
};

export const useDeleteQuestion = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AssignmentsService.deleteQuestion,
    onSuccess: (data) => {
      // Invalidate all assignments to be safe or we need the assignment ID being passed back
      queryClient.invalidateQueries(["assignments"]);
      queryClient.invalidateQueries(["assignment"]); // Broad invalidation to ensure freshness
      if (options.onSuccess) options.onSuccess(data);
    },
    onError: (error) => {
      if (options.onError) options.onError(error);
      else toast.error("Failed to delete question");
    },
  });
};
