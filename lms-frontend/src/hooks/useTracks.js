import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TrackService from "../services/TrackService";

export const useTracks = (params) => {
  return useQuery({
    queryKey: ["tracks", params],
    queryFn: () => TrackService.getAllTracks(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useTrack = (id) => {
  return useQuery({
    queryKey: ["track", id],
    queryFn: () => TrackService.getTrackById(id),
    enabled: !!id,
  });
};

export const useInstructorTracks = (instructorId, params) => {
  return useQuery({
    queryKey: ["tracks-instructor", instructorId, params],
    queryFn: () => TrackService.getInstructorTracks(instructorId, params),
    enabled: !!instructorId,
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateTrack = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: TrackService.createTrack,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      queryClient.invalidateQueries({ queryKey: ["tracks-instructor"] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useUpdateTrack = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => TrackService.updateTrack(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      const { id } = variables;
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      queryClient.invalidateQueries({ queryKey: ["tracks-instructor"] });
      queryClient.invalidateQueries({ queryKey: ["track", id] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useDeleteTrack = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: TrackService.deleteTrack,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      queryClient.invalidateQueries({ queryKey: ["tracks-instructor"] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useAddCourseToTrack = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ trackId, courseId }) =>
      TrackService.addCourseToTrack(trackId, courseId),
    ...options,
    onSuccess: (data, variables, context) => {
      const { trackId } = variables;
      queryClient.invalidateQueries({ queryKey: ["track", trackId] });
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useRemoveCourseFromTrack = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ trackId, courseId }) =>
      TrackService.removeCourseFromTrack(trackId, courseId),
    ...options,
    onSuccess: (data, variables, context) => {
      const { trackId } = variables;
      queryClient.invalidateQueries({ queryKey: ["track", trackId] });
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useTopTracks = (limit = 10) => {
  return useQuery({
    queryKey: ["top-tracks", limit],
    queryFn: () => TrackService.getTopTracks(limit),
  });
};
