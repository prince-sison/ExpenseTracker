import { useState } from "react";
import { useDashboardSummary } from "./useGetDashboardSummary";
import MonthSelector, {
  type Month,
} from "@/shared/components/ui/MonthSelector";
import LoadingSpinner from "@/shared/components/ui/LoadingSpinner";
import ErrorAlert from "@/shared/components/ui/ErrorAlert";
import TotalSpentCard from "./TotalSpentCard";
import BudgetProgressList from "./BudgetProgressList";
import DailySpendingChart from "./DailySpendingChart";
import RecentExpensesList from "./RecentExpensesList";

export default function DashboardPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { data, isLoading, isError, refetch } = useDashboardSummary(
    month,
    year,
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <MonthSelector
          month={month as Month}
          year={year}
          onChange={(m, y) => {
            setMonth(m);
            setYear(y);
          }}
        />
      </div>

      {isLoading && (
        <LoadingSpinner size="lg" label="Loading dashboard summary..." />
      )}

      {isError && (
        <ErrorAlert
          message="Failed to load dashboard data."
          onRetry={() => refetch()}
        />
      )}

      {data && (
        <div className="flex flex-col gap-6">
          <TotalSpentCard total={data.totalSpent} />

          <div className="card bg-base-100 p-4 shadow">
            <h2 className="mb-2 text-lg font-semibold">Budgets</h2>
            <BudgetProgressList budgetUtilization={data.budgetUtilization} />
          </div>

          <div className="card bg-base-100 p-4 shadow">
            <h2 className="mb-2 text-lg font-semibold">Daily Spending</h2>
            <div className="h-64 w-full">
              <DailySpendingChart dailySpending={data.dailySpending} />
            </div>
          </div>

          <div className="card bg-base-100 p-4 shadow">
            <h2 className="mb-2 text-lg font-semibold">Recent Expenses</h2>
            <RecentExpensesList recentExpenses={data.recentExpenses} />
          </div>
        </div>
      )}
    </div>
  );
}
