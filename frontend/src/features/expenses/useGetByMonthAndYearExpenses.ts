import { useQuery } from "@tanstack/react-query";
import { expenseService } from "./expenseService";
import type { Expense } from "./expenses.types";
import { queryKeys } from "@/shared/api/queryKeys";

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
