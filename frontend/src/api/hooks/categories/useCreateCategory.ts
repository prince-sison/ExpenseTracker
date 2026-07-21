import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateCategoryRequest } from "../../types/Categories";
import { categoryService } from "../../services/categoryService";
import { queryKeys } from "../../router/queryKeys";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData: CreateCategoryRequest) =>
      categoryService.createCategory(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
    onError: (error) => {
      console.error("Error creating category:", error);
    },
  });
};
