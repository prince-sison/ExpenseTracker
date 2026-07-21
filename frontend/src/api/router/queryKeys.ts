/**
 * Centralized React Query keys.
 *
 * Hierarchical (factory) pattern:
 * - `.all` is the base key of each entity — use it with `invalidateQueries`
 *   to refresh ALL queries of that entity.
 * - `.list()` / `.detail()` for more specific queries.
 *
 * Example: `invalidateQueries({ queryKey: queryKeys.expenses.all })`
 * will match all `["expenses", ...]`.
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
