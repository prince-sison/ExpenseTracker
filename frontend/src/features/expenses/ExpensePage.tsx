import { useState } from "react";
import type { Expense } from "./expenses.types";
import { useGetByMonthAndYearExpenses } from "./useGetByMonthAndYearExpenses";
import MonthSelector, {
  type Month,
} from "@/shared/components/ui/MonthSelector";
import AddExpenseForm from "./AddExpenseForm";
import ExpenseDataGrid from "./ExpenseDataGrid";
import EditExpenseModal from "./EditExpenseModal";
import DeleteExpenseConfirm from "./DeleteExpenseConfirm";

export default function ExpensePage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [editing, setEditing] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState<Expense | null>(null);

  const { data: expenses = [], isLoading } = useGetByMonthAndYearExpenses(
    month,
    year,
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Expenses</h1>

        <MonthSelector
          month={month as Month}
          year={year}
          onChange={(newMonth, newYear) => {
            setMonth(newMonth);
            setYear(newYear);
          }}
        />
      </div>

      <AddExpenseForm />
      <ExpenseDataGrid
        expenses={expenses}
        isLoading={isLoading}
        onEdit={(e) => setEditing(e)}
        onDelete={(e) => setDeleting(e)}
      />

      {editing && (
        <EditExpenseModal expense={editing} onClose={() => setEditing(null)} />
      )}

      {deleting && (
        <DeleteExpenseConfirm
          expense={deleting}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
