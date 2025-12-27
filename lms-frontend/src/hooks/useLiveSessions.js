import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LiveSessionsService from "../services/LiveSessionsService";
import { toast } from "react-toastify";

export const useSessions = (params) => {
  return useQuery({
    queryKey: ["sessions", params],
    queryFn: () => LiveSessionsService.getSessions(params),
  });
};

export const useInstructorSessions = (instructorId) => {
  return useQuery({
    queryKey: ["sessions", { instructorId }],
    queryFn: () => LiveSessionsService.getInstructorSessions(instructorId),
    enabled: !!instructorId,
  });
};

export const useSessionDetails = (sessionName) => {
  return useQuery({
    queryKey: ["sessionDetails", sessionName],
    queryFn: () => LiveSessionsService.getSessionByName(sessionName),
    enabled: !!sessionName,
  });
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => LiveSessionsService.createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["sessions"]);
      toast.success("Live session created successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create live session"
      );
    },
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionName) => LiveSessionsService.deleteSession(sessionName),
    onSuccess: () => {
      queryClient.invalidateQueries(["sessions"]);
      toast.success("Live session deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete live session"
      );
    },
  });
};

export const useStartRecording = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionName) =>
      LiveSessionsService.startRecording(sessionName),
    onSuccess: (data, sessionName) => {
      toast.success("Recording started");
      queryClient.invalidateQueries(["sessionDetails", sessionName]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to start recording");
    },
  });
};

export const useStopRecording = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionName) => LiveSessionsService.stopRecording(sessionName),
    onSuccess: (data, sessionName) => {
      toast.success("Recording stopped");
      queryClient.invalidateQueries(["sessionDetails", sessionName]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to stop recording");
    },
  });
};

export const useUpdateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => LiveSessionsService.updateSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["sessions"]);
      toast.success("Session updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update session");
    },
  });
};

export const useUpdateStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) =>
      LiveSessionsService.updateSessionStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["sessions"]);
      toast.success("Session status updated");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });
};

export const useLiveSessions = () => ({
  useSessions,
  useInstructorSessions,
  useSessionDetails,
  createSessionMutation: useCreateSession(),
  deleteSessionMutation: useDeleteSession(),
  startRecordingMutation: useStartRecording(),
  stopRecordingMutation: useStopRecording(),
  updateSessionMutation: useUpdateSession(),
  updateStatusMutation: useUpdateStatus(),
});
