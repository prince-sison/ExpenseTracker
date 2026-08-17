import { useState } from "react";
import type { Category } from "../categories/categories.types";
import { useGetAllCategories } from "../categories/useGetAllCategories";
import { useGetBudgetByMonthAndYear } from "./useGetBudgetByMonthAndYear";
import MonthSelector, {
  type Month,
} from "@/shared/components/ui/MonthSelector";
import LoadingSpinner from "@/shared/components/ui/LoadingSpinner";
import ErrorAlert from "@/shared/components/ui/ErrorAlert";
import BudgetCard from "./BudgetCard";
import SetBudgetModal from "./SetBudgetModal";

export default function BudgetPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [selected, setSelected] = useState<Category | null>(null);

  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useGetAllCategories();
  const {
    data: budgets = [],
    isLoading: isBudgetsLoading,
    isError: isBudgetsError,
    refetch: refetchBudgets,
  } = useGetBudgetByMonthAndYear(month, year);

  const isLoading = isCategoriesLoading || isBudgetsLoading;
  const isError = isCategoriesError || isBudgetsError;

  const selectedBudget = selected
    ? budgets.find((b) => b.categoryId === selected.id)
    : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Budgets</h1>
        <MonthSelector
          month={month as Month}
          year={year}
          onChange={(m, y) => {
            setMonth(m);
            setYear(y);
          }}
        />
      </div>

      {isLoading && <LoadingSpinner label="Loading budgets..." />}

      {isError && (
        <ErrorAlert
          message="Failed to load budgets."
          onRetry={() => {
            refetchCategories();
            refetchBudgets();
          }}
        />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          // Hanapin ang budget ng kategoryang ito; undefined kung wala.
          const budget = budgets.find((b) => b.categoryId === category.id);
          return (
            <BudgetCard
              key={category.id}
              category={category}
              budget={budget}
              onSetBudget={(c) => setSelected(c)}
            />
          );
        })}
      </div>

      {selected && (
        <SetBudgetModal
          category={selected}
          month={month}
          year={year}
          existingBudget={selectedBudget}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
