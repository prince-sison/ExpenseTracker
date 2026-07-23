import { useCreateCategory } from "../../../api/hooks/categories/useCreateCategory";
import { categorySchema, type CategoryFormValues } from "./categorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function CategoryForm() {
  const createCategory = useCreateCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", color: "#000000" },
  });

  const onSubmit = (data: CategoryFormValues) => {
    createCategory.mutate(data, {
      onSuccess: () => reset(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-3">
      <div className="flex flex-col">
        <label className="label" htmlFor="new-category-name">
          Name
        </label>
        <input
          id="new-category-name"
          className="input input-bordered"
          {...register("name")}
        />
        {errors.name && (
          <span className="text-error text-sm">{errors.name.message}</span>
        )}
      </div>

      <div className="flex flex-col">
        <label className="label" htmlFor="new-category-color">
          Color
        </label>
        <input
          id="new-category-color"
          type="color"
          className="h-10 w-16"
          {...register("color")}
        />
        {errors.color && (
          <span className="text-error text-sm">{errors.color.message}</span>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={createCategory.isPending}
      >
        {createCategory.isPending ? "Adding..." : "Add Category"}
      </button>
    </form>
  );
}
