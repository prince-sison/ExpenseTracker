import { zodResolver } from "@hookform/resolvers/zod";
import type { Category } from "../categories/categories.types";
import type { Budget } from "./budgets.types";
import { budgetSchema, type BudgetFormValues } from "./budgetSchema";
import { useUpsertBudget } from "./useUpsertBudget";
import { useForm } from "react-hook-form";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface SetBudgetModalProps {
  category: Category;
  month: number;
  year: number;
  existingBudget?: Budget;
  onClose: () => void;
}

export default function SetBudgetModal({
  category,
  month,
  year,
  existingBudget,
  onClose,
}: SetBudgetModalProps) {
  const upsertBudget = useUpsertBudget();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    values: { limitAmount: existingBudget?.limitAmount ?? 0 },
  });

  const onSubmit = (data: BudgetFormValues) => {
    upsertBudget.mutate(
      {
        categoryId: category.id,
        limitAmount: data.limitAmount,
        month,
        year,
      },
      {
        onSuccess: onClose,
      },
    );
  };

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
        <h3 className="text-lg font-bold">
          {existingBudget ? "Update Budget" : "Set Budget"}
        </h3>

        <div className="flex items-center gap-2 pt-2 text-sm text-base-content/70">
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <span className="font-medium">{category.name}</span>
          <span>.</span>
          <span>
            {MONTH_NAMES[month - 1]} {year}
          </span>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 pt-4"
        >
          <div className="flex flex-col">
            <label htmlFor="budget-limit" className="label">
              Limit Amount
            </label>

            <input
              id="budget-limit"
              type="number"
              step="0.01"
              className="input input-bordered"
              {...register("limitAmount", { valueAsNumber: true })}
            />

            {errors.limitAmount && (
              <span className="text-error text-sm">
                {errors.limitAmount.message}
              </span>
            )}
          </div>

          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={upsertBudget.isPending}
            >
              {upsertBudget.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
