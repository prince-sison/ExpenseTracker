import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";
import type { UpdateCategoryRequest } from "../../types/Categories";
import { queryKeys } from "../../router/queryKeys";

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData: UpdateCategoryRequest) =>
      categoryService.updateCategory(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
    onError: (error) => {
      console.error("Error updating category:", error);
    },
  });
};
