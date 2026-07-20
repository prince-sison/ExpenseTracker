import { api } from "../baseApi";
import type {
  Expenses,
  CreateExpenseRequest,
  UpdateExpenseRequest,
} from "../types/Expenses";

export const expenseService = {
  getAllExpenses: async (
    month: number,
    year: number,
    categoryId?: string,
  ): Promise<Expenses[]> => {
    const response = await api.get("/expenses", {
      params: { month, year, categoryId },
    });
    return response.data;
  },

  getExpenseById: async (expenseId: string): Promise<Expenses> => {
    const response = await api.get(`/expenses/${expenseId}`);
    return response.data;
  },

  createExpense: async (
    expenseData: CreateExpenseRequest,
  ): Promise<Expenses> => {
    const response = await api.post("/expenses", expenseData);
    return response.data;
  },

  updateExpense: async (
    expenseId: string,
    expenseData: UpdateExpenseRequest,
  ): Promise<Expenses> => {
    const response = await api.put(`/expenses/${expenseId}`, expenseData);
    return response.data;
  },

  deleteExpense: async (expenseId: string): Promise<void> => {
    await api.delete(`/expenses/${expenseId}`);
  },
};
