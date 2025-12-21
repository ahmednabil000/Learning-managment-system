import { useQuery } from "@tanstack/react-query";
import CoursesService from "../services/CoursesService";

export const useCourses = (params) => {
  return useQuery({
    queryKey: ["courses", params],
    queryFn: () => CoursesService.fetchCourses(params),
    placeholderData: (previousData) => previousData, // Equivalent to keepPreviousData in v5
  });
};
