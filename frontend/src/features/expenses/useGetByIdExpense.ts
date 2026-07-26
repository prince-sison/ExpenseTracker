import type { Expense } from "./expenses.types";
import { useQuery } from "@tanstack/react-query";
import { expenseService } from "./expenseService";
import { queryKeys } from "@/shared/api/queryKeys";

export const useGetByIdExpense = (expenseId: string) => {
  return useQuery({
    queryKey: queryKeys.expenses.detail(expenseId),
    queryFn: async (): Promise<Expense> => {
      const response = await expenseService.getExpenseById(expenseId);
      return response;
    },
  });
};
