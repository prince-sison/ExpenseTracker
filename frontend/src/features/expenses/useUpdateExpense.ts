import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateExpenseRequest } from "./expenses.types";
import { expenseService } from "./expenseService";
import { queryKeys } from "@/shared/api/queryKeys";

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
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
    onError: (error) => {
      console.error("Error updating expense:", error);
    },
  });
};
