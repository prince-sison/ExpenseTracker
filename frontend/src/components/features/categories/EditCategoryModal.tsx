import { useForm } from "react-hook-form";
import { categorySchema } from "./categorySchema";
import { useUpdateCategory } from "../../../api/hooks/categories/useUpdateCategory";
import type { Category } from "../../../api/types/Categories";
import type { CategoryFormValues } from "./categorySchema";
import { zodResolver } from "@hookform/resolvers/zod";

interface EditCategoryModalProps {
  category: Category | null;
  onClose: () => void;
}

export default function EditCategoryModal({
  category,
  onClose,
}: EditCategoryModalProps) {
  const updateCategory = useUpdateCategory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    values: category
      ? { name: category.name, color: category.color }
      : { name: "", color: "#000000" },
  });

  const onSubmit = (data: CategoryFormValues) => {
    if (!category) return;
    updateCategory.mutate({ id: category.id, ...data }, { onSuccess: onClose });
  };

  if (!category) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-lg font-bold">Edit Category</h3>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 pt-4"
        >
          <input className="input input-bordered" {...register("name")} />
          {errors.name && (
            <span className="text-error text-sm">{errors.name.message}</span>
          )}

          <div className="flex flex-col">
            <label className="label">Color</label>
            <input type="color" className="h-10 w-16" {...register("color")} />
            {errors.color && (
              <span className="text-error text-sm">{errors.color.message}</span>
            )}
          </div>

          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={updateCategory.isPending}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
