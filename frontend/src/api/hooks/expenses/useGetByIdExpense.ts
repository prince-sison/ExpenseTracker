import type { Expense } from "../../types/Expenses";
import { useQuery } from "@tanstack/react-query";
import { expenseService } from "../../services/expenseService";
import { queryKeys } from "../../types/queryKeys";

export const useGetByIdExpense = (expenseId: string) => {
  return useQuery({
    queryKey: queryKeys.expenses.detail(expenseId),
    queryFn: async (): Promise<Expense> => {
      const response = await expenseService.getExpenseById(expenseId);
      return response;
    },
  });
};
