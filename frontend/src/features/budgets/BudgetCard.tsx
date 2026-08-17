import CurrencyDisplay from "@/shared/components/ui/CurrencyDisplay";
import type { Category } from "../categories/categories.types";
import type { Budget } from "./budgets.types";

interface BudgetCardProps {
  category: Category;
  budget?: Budget;
  onSetBudget: (category: Category) => void;
}

export default function BudgetCard({
  category,
  budget,
  onSetBudget,
}: BudgetCardProps) {
  const hasBudget = budget !== undefined;

  return (
    <div className="card bg-base-100 p-4 shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <span className="font-medium">{category.name}</span>
        </div>

        <div className="text-sm">
          {hasBudget ? (
            <CurrencyDisplay amount={budget.limitAmount} />
          ) : (
            <span className="text-base-content/60">no limit set</span>
          )}
        </div>
      </div>

      <div className="mt-3">
        <button
          className="btn btn-sm btn-primary"
          type="button"
          onClick={() => onSetBudget(category)}
        >
          {hasBudget ? "Update Budget" : "Set Budget"}
        </button>
      </div>
    </div>
  );
}
