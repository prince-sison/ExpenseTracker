import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateExpenseRequest } from "./expenses.types";
import { expenseService } from "./expenseService";
import { queryKeys } from "@/shared/api/queryKeys";

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseData: CreateExpenseRequest) =>
      expenseService.createExpense(expenseData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
    onError: (error) => {
      console.error("Error creating expense:", error);
    },
  });
};
