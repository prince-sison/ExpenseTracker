import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useGetAllCategories } from "../categories/useGetAllCategories";
import {
  expenseSchema,
  todayIsoString,
  type ExpenseFormValues,
} from "./expenseSchema";
import { useCreateExpense } from "./useCreateExpense";

export default function AddExpenseForm() {
  const createExpense = useCreateExpense();
  const { data: categories } = useGetAllCategories();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: { date: todayIsoString },
  });

  const onSubmit = (data: ExpenseFormValues) => {
    createExpense.mutate(data, {
      onSuccess: () => reset({ date: todayIsoString }),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div className="flex flex-col">
        <label htmlFor="expense-amount" className="label">
          Amount
        </label>
        <input
          id="expense-amount"
          type="number"
          step="0.01"
          className="input input-bordered"
          {...register("amount", { valueAsNumber: true })}
        />

        {errors.amount && (
          <span className="text-error text-sm">{errors.amount.message}</span>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="expense-description" className="label">
          Description
        </label>
        <input
          id="expense-description"
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
        <label htmlFor="expense-category" className="label">
          Category
        </label>
        <select
          id="expense-category"
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
        <label htmlFor="expense-date" className="label">
          Date
        </label>
        <input
          id="expense-date"
          type="date"
          className="input input-bordered"
          {...register("date")}
        />

        {errors.date && (
          <span className="text-error text-sm">{errors.date.message}</span>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={createExpense.isPending}
      >
        {createExpense.isPending ? "Adding..." : "Add Expense"}
      </button>
    </form>
  );
}
