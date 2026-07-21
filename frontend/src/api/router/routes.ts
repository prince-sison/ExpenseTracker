export const Routes = {
  /** Expenses routes */
  getAllExpenses: { method: "GET", path: "/api/expenses" },
  getByIdExpense: { method: "GET", path: "/api/expenses/:expenseId" },
  createExpense: { method: "POST", path: "/api/expenses" },
  updateExpense: { method: "PUT", path: "/api/expenses/:expenseId" },
  deleteExpense: { method: "DELETE", path: "/api/expenses/:expenseId" },

  /** Categories routes */
  getAllCategories: { method: "GET", path: "/api/categories" },
  createCategory: { method: "POST", path: "/api/categories" },
  updateCategory: { method: "PUT", path: "/api/categories" },
  deleteCategory: { method: "DELETE", path: "/api/categories/:categoryId" },

  /** Budgets routes */
  getBudgetsByMonthAndYear: { method: "GET", path: "/api/budgets" },
  upsertBudget: { method: "POST", path: "/api/budgets" },
  deleteBudget: { method: "DELETE", path: "/api/budgets/:budgetId" },

  /** Dashboard routes */
  getDashboardSummary: { method: "GET", path: "/api/dashboard" },
};

export const buildPath = (
  route: { path: string },
  params?: Record<string, string | number>,
): string => {
  if (!params) return route.path;

  return Object.entries(params).reduce(
    (path, [key, value]) =>
      path.replace(`:${key}`, encodeURIComponent(String(value))),
    route.path,
  );
};
