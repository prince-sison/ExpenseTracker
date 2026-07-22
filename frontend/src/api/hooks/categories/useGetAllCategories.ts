import { useQuery } from "@tanstack/react-query";
import type { Category } from "../../types/Categories";
import { queryKeys } from "../../types/queryKeys";
import { categoryService } from "../../services/categoryService";

export const useGetAllCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: async (): Promise<Category[]> => {
      const response = await categoryService.getAllCategories();
      return response;
    },
  });
};
