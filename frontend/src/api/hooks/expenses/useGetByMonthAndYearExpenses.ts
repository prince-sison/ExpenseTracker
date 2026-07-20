import { useQuery } from "@tanstack/react-query";
import { expenseService } from "../../services/expenseService";
import type { Expenses } from "../../types/Expenses";
import { queryKeys } from "../../router/queryKeys";

export const useGetByMonthAndYearExpenses = (
  month: number,
  year: number,
  categoryId?: string,
) => {
  return useQuery({
    queryKey: queryKeys.expenses.list(month, year, categoryId),
    queryFn: async (): Promise<Expenses[]> => {
      const response = await expenseService.getAllExpenses(
        month,
        year,
        categoryId,
      );
      return response;
    },
  });
};
