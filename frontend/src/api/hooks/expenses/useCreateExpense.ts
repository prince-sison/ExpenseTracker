import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateExpenseRequest } from "../../types/Expenses";
import { expenseService } from "../../services/expenseService";
import { queryKeys } from "../../router/queryKeys";

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseData: CreateExpenseRequest) =>
      expenseService.createExpense(expenseData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all });
    },
    onError: (error) => {
      console.error("Error creating expense:", error);
    },
  });
};
