/**
 * Sentralong React Query keys.
 *
 * Hierarchical (factory) pattern:
 * - `.all` ang base key ng bawat entity — gamitin sa `invalidateQueries`
 *   para i-refresh ang LAHAT ng query ng entity na iyon.
 * - `.list()` / `.detail()` para sa mas tiyak na queries.
 *
 * Halimbawa: `invalidateQueries({ queryKey: queryKeys.expenses.all })`
 * ay magma-match sa lahat ng `["expenses", ...]`.
 */
export const queryKeys = {
  expenses: {
    all: ["expenses"] as const,
    list: (month: number, year: number, categoryId?: string) =>
      [...queryKeys.expenses.all, "list", month, year, categoryId] as const,
    detail: (expenseId: string) =>
      [...queryKeys.expenses.all, "detail", expenseId] as const,
  },
  categories: {
    all: ["categories"] as const,
  },
  budgets: {
    all: ["budgets"] as const,
    list: (month: number, year: number) =>
      [...queryKeys.budgets.all, "list", month, year] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
    summary: (month: number, year: number) =>
      [...queryKeys.dashboard.all, "summary", month, year] as const,
  },
} as const;
