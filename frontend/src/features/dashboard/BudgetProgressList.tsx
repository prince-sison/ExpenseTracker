import CurrencyDisplay from "@/shared/components/ui/CurrencyDisplay";
import type { BudgetUtilization } from "./dashboard.types";

interface BudgetProgressListProps {
  budgetUtilization: BudgetUtilization[];
}

export default function BudgetProgressList({
  budgetUtilization,
}: BudgetProgressListProps) {
  return (
    <div className="flex flex-col gap-4">
      {budgetUtilization.map((item) => (
        <div key={item.categoryId} className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: item.categoryColor }}
              />
              <span className="font-medium">{item.categoryName}</span>

              {item.isOverBudget && (
                <span className="badge badge-error badge-sm">Over Budget</span>
              )}
            </div>

            <div className="text-sm">
              <CurrencyDisplay amount={item.spent} />
              {item.limit !== null && (
                <>
                  {" / "}
                  <CurrencyDisplay amount={item.limit} />
                </>
              )}
            </div>
          </div>

          {item.limit === null || item.percentage === null ? (
            <span className="text-sm text-base-content/60">no limit set</span>
          ) : (
            <progress
              className={`progress ${item.isOverBudget ? "progress-error" : "progress-primary"}`}
              value={item.percentage}
              max={100}
            ></progress>
          )}
        </div>
      ))}
    </div>
  );
}
