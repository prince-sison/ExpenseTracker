import { useMutation, useQueryClient } from "@tanstack/react-query";
import { budgetService } from "../../services/budgetService";
import { queryKeys } from "../../router/queryKeys";

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budgetId: string) => {
      const response = await budgetService.deleteBudget(budgetId);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
    onError: (error) => {
      console.error("Error deleting budget:", error);
    },
  });
};
