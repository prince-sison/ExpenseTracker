import { api } from "../baseApi";
import type { UpsertBudgetRequest } from "../types/Budgets";

export const budgetService = {
  getBudget: async (month: number, year: number): Promise<number> => {
    const response = await api.get("/budget", {
      params: { month, year },
    });
    return response.data;
  },

  upsertBudget: async (budgetData: UpsertBudgetRequest): Promise<void> => {
    await api.post("/budget", budgetData);
  },

  deleteBudget: async (budgetId: string): Promise<void> => {
    await api.delete(`/budget/${budgetId}`);
  },
};
