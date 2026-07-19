import type { Expenses } from "./Expenses";

export interface Dashboard {
  month: number;
  year: number;
  totalSpent: number;
  budgetUtilization: BudgetUtilization[];
  dailySpending: DailySpending[];
  recentExpenses: Expenses[];
}

export interface BudgetUtilization {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  spent: number;
  limit: number | null;
  percentage: number | null;
  isOverBudget: boolean;
}

export interface DailySpending {
  date: string; // Format: YYYY-MM-DD
  total: number;
}
