import { useQuery } from "@tanstack/react-query";
import type { Categories } from "../../types/Categories";
import { queryKeys } from "../../router/queryKeys";
import { categoryService } from "../../services/categoryService";

export const useGetAllCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: async (): Promise<Categories[]> => {
      const response = await categoryService.getAllCategories();
      return response;
    },
  });
};
