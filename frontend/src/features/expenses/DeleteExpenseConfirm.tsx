import type { Expense } from "./expenses.types";
import { useDeleteExpense } from "./useDeleteExpense";

interface DeleteExpenseConfirmProps {
  expense: Expense | null;
  onClose: () => void;
}

export default function DeleteExpenseConfirm({
  expense,
  onClose,
}: DeleteExpenseConfirmProps) {
  const deleteExpense = useDeleteExpense();

  if (!expense) return null;

  const handleDelete = () => {
    deleteExpense.mutate(
      {
        expenseId: expense.id,
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
        <h3 className="text-lg font-bold">Delete Expense</h3>
        <p className="py-4">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{expense.description}</span>? This
          action cannot be undone.
        </p>

        <div className="modal-action">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-error"
            onClick={handleDelete}
            disabled={deleteExpense.isPending}
          >
            {deleteExpense.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
