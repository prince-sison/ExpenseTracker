import { useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseService } from "./expenseService";
import { queryKeys } from "@/shared/api/queryKeys";

interface DeleteExpenseArgs {
  expenseId: string;
}

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ expenseId }: DeleteExpenseArgs) =>
      expenseService.deleteExpense(expenseId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
    onError: (error) => {
      console.error("Error deleting expense:", error);
    },
  });
};
