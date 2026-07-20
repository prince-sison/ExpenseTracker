import { baseApiProvider as api } from "../baseApi";
import { buildPath, Routes } from "../router/routes";
import type { UpsertBudgetRequest } from "../types/Budgets";

export const budgetService = {
  getBudget: async (month: number, year: number): Promise<number> => {
    const url = buildPath(Routes.getBudgetsByMonthAndYear);
    const response = await api.get(url, {
      params: { month, year },
    });
    return response.data;
  },

  upsertBudget: async (budgetData: UpsertBudgetRequest): Promise<void> => {
    const url = buildPath(Routes.upsertBudget);
    await api.post(url, budgetData);
  },

  deleteBudget: async (budgetId: string): Promise<void> => {
    const url = buildPath(Routes.deleteBudget, { budgetId });
    await api.delete(url);
  },
};
