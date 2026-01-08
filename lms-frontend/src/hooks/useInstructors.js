import { useQuery } from "@tanstack/react-query";
import InstructorService from "../services/InstructorService";

export const useInstructor = (id) => {
  return useQuery({
    queryKey: ["instructor", id],
    queryFn: () => InstructorService.getInstructorById(id),
    enabled: !!id,
  });
};

export const useInstructorCoursesPublic = (
  instructorId,
  page = 1,
  limit = 10
) => {
  return useQuery({
    queryKey: ["instructor-courses-public", instructorId, page, limit],
    queryFn: () =>
      InstructorService.getInstructorCoursesPublic(instructorId, page, limit),
    enabled: !!instructorId,
    keepPreviousData: true,
  });
};
