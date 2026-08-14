import type { Expense } from "./expenses.types";
import { useGetAllCategories } from "../categories/useGetAllCategories";
import { expenseSchema, type ExpenseFormValues } from "./expenseSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useUpdateExpense } from "./useUpdateExpense";

interface EditExpenseModalProps {
  expense: Expense | null;
  onClose: () => void;
}

export default function EditExpenseModal({
  expense,
  onClose,
}: EditExpenseModalProps) {
  const updateExpense = useUpdateExpense();
  const { data: categories } = useGetAllCategories();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    values: expense
      ? {
          amount: expense.amount,
          description: expense.description,
          categoryId: expense.categoryId,
          date: expense.date.split("T")[0],
        }
      : {
          amount: 0,
          description: "",
          categoryId: "",
          date: "",
        },
  });

  const onSubmit = (data: ExpenseFormValues) => {
    if (!expense) return;
    updateExpense.mutate(
      { expenseId: expense.id, expenseData: data },
      { onSuccess: onClose },
    );
  };

  if (!expense) return null;

  return (
    <dialog
      className="modal modal-open"
      open
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div className="modal-box">
        <h3 className="text-lg font-bold">Edit Expense</h3>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 pt-4"
        >
          <div className="flex flex-col">
            <label htmlFor="edit-expense-amount" className="label">
              Amount
            </label>

            <input
              id="edit-expense-amount"
              type="number"
              step="0.01"
              className="input input-bordered"
              {...register("amount", { valueAsNumber: true })}
            />

            {errors.amount && (
              <span className="text-error text-sm">
                {errors.amount.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="edit-expense-description" className="label">
              Description
            </label>
            <input
              id="edit-expense-description"
              className="input input-bordered"
              {...register("description")}
            />

            {errors.description && (
              <span className="text-error text-sm">
                {errors.description.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="edit-expense-category" className="label">
              Category
            </label>
            <select
              id="edit-expense-category"
              className="select select-bordered"
              {...register("categoryId")}
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {errors.categoryId && (
              <span className="text-error text-sm">
                {errors.categoryId.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="edit-expense-date" className="label">
              Date
            </label>
            <input
              id="edit-expense-date"
              type="date"
              className="input input-bordered"
              {...register("date")}
            />

            {errors.date && (
              <span className="text-error text-sm">{errors.date.message}</span>
            )}
          </div>

          <div className="modal-acation">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={updateExpense.isPending}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
