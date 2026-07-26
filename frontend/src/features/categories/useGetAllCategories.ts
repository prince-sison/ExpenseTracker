import { useQuery } from "@tanstack/react-query";
import type { Category } from "./categories.types";
import { queryKeys } from "@/shared/api/queryKeys";
import { categoryService } from "./categoryService";

export const useGetAllCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: async (): Promise<Category[]> => {
      const response = await categoryService.getAllCategories();
      return response;
    },
  });
};
