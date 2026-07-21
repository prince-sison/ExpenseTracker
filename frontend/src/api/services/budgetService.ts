import { baseApiProvider as api } from "../baseApi";
import { buildPath, Routes } from "../router/routes";
import type { Budget, UpsertBudgetRequest } from "../types/Budgets";

export const budgetService = {
  getBudgets: async (month: number, year: number): Promise<Budget[]> => {
    const url = buildPath(Routes.getBudgetsByMonthAndYear);
    const response = await api.get(url, {
      params: { month, year },
    });
    return response.data;
  },

  upsertBudget: async (budgetData: UpsertBudgetRequest): Promise<Budget> => {
    const url = buildPath(Routes.upsertBudget);
    const response = await api.post(url, budgetData);
    return response.data;
  },

  deleteBudget: async (budgetId: string): Promise<void> => {
    const url = buildPath(Routes.deleteBudget, { budgetId });
    await api.delete(url);
  },
};
