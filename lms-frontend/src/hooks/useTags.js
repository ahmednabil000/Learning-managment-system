import { useQuery } from "@tanstack/react-query";
import TagsService from "../services/TagsService";

export const useTags = (params) => {
  return useQuery({
    queryKey: ["tags", params],
    queryFn: () => TagsService.fetchTags(params),
  });
};

export const useTag = (id) => {
  return useQuery({
    queryKey: ["tag", id],
    queryFn: () => TagsService.fetchTagById(id),
    enabled: !!id,
  });
};
