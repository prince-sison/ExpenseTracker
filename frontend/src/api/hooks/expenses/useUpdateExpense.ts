import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateExpenseRequest } from "../../types/Expenses";
import { expenseService } from "../../services/expenseService";
import { queryKeys } from "../../router/queryKeys";

interface UpdateExpenseArgs {
  expenseId: string;
  expenseData: UpdateExpenseRequest;
}

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ expenseId, expenseData }: UpdateExpenseArgs) =>
      expenseService.updateExpense(expenseId, expenseData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all });
    },
    onError: (error) => {
      console.error("Error updating expense:", error);
    },
  });
};
