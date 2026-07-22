import { useQuery } from "@tanstack/react-query";
import { expenseService } from "../../services/expenseService";
import type { Expense } from "../../types/Expenses";
import { queryKeys } from "../../types/queryKeys";

export const useGetByMonthAndYearExpenses = (
  month: number,
  year: number,
  categoryId?: string,
) => {
  return useQuery({
    queryKey: queryKeys.expenses.list(month, year, categoryId),
    queryFn: async (): Promise<Expense[]> => {
      const response = await expenseService.getAllExpenses(
        month,
        year,
        categoryId,
      );
      return response;
    },
  });
};
