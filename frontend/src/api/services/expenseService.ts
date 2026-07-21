import { baseApiProvider as api } from "../baseApi";
import { buildPath, Routes } from "../router/routes";
import type {
  Expense,
  CreateExpenseRequest,
  UpdateExpenseRequest,
} from "../types/Expenses";

export const expenseService = {
  getAllExpenses: async (
    month: number,
    year: number,
    categoryId?: string,
  ): Promise<Expense[]> => {
    const url = buildPath(Routes.getAllExpenses);
    const response = await api.get(url, {
      params: { month, year, categoryId },
    });
    return response.data;
  },

  getExpenseById: async (expenseId: string): Promise<Expense> => {
    const url = buildPath(Routes.getByIdExpense, { expenseId });
    const response = await api.get(url);
    return response.data;
  },

  createExpense: async (
    expenseData: CreateExpenseRequest,
  ): Promise<Expense> => {
    const url = buildPath(Routes.createExpense);
    const response = await api.post(url, expenseData);
    return response.data;
  },

  updateExpense: async (
    expenseId: string,
    expenseData: UpdateExpenseRequest,
  ): Promise<Expense> => {
    const url = buildPath(Routes.updateExpense, { expenseId });
    const response = await api.put(url, expenseData);
    return response.data;
  },

  deleteExpense: async (expenseId: string): Promise<void> => {
    const url = buildPath(Routes.deleteExpense, { expenseId });
    await api.delete(url);
  },
};
