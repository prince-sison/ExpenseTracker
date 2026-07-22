import { useMutation, useQueryClient } from "@tanstack/react-query";
import { budgetService } from "../../services/budgetService";
import type { UpsertBudgetRequest } from "../../types/Budgets";
import { queryKeys } from "../../types/queryKeys";

export const useUpsertBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budgetData: UpsertBudgetRequest) => {
      const response = await budgetService.upsertBudget(budgetData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
    onError: (error) => {
      console.error("Error upserting budget:", error);
    },
  });
};
