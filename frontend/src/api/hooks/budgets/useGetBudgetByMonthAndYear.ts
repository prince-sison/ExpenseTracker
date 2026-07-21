import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../router/queryKeys";
import type { Budget } from "../../types/Budgets";
import { budgetService } from "../../services/budgetService";

export const useGetBudgetByMonthAndYear = (month: number, year: number) => {
  return useQuery({
    queryKey: queryKeys.budgets.list(month, year),
    queryFn: async ({ queryKey: [, , month, year] }): Promise<Budget[]> => {
      const response = await budgetService.getBudgets(month, year);
      return response;
    },
  });
};
