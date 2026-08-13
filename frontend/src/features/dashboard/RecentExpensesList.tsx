import CurrencyDisplay from "@/shared/components/ui/CurrencyDisplay";
import type { Expense } from "../expenses/expenses.types";

interface RecentExpensesListProps {
  recentExpenses: Expense[];
}

export default function RecentExpensesList({
  recentExpenses,
}: RecentExpensesListProps) {
  if (recentExpenses.length === 0) {
    return (
      <div className="py-8 text-center text-base-content/60">
        No expenses yet this month. Add one to get started!
      </div>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-base-200">
      {recentExpenses.map((expense) => (
        <li
          key={expense.id}
          className="flex items-center justify-between gap-3 py-3"
        >
          <div className="flex items-center gap-3">
            <span
              className="badge badge-sm"
              style={{ backgroundColor: expense.categoryColor, color: "#fff" }}
            >
              {expense.categoryName}
            </span>
            <span className="font-medium">{expense.description}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-base-content/60">
              {new Date(expense.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
            <CurrencyDisplay
              amount={expense.amount}
              className="font-semibold"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
