import { useState } from "react";
import { useDeleteCategory } from "../../../api/hooks/categories/useDeleteCategory";
import { useGetAllCategories } from "../../../api/hooks/categories/useGetAllCategories";
import type { Category } from "../../../api/types/Categories";
import LoadingSpinner from "../../shared/ui/LoadingSpinner";
import ErrorAlert from "../../shared/ui/ErrorAlert";
import CategoryForm from "./CategoryForm";
import EmptyState from "../../shared/ui/EmptyState";
import EditCategoryModal from "./EditCategoryModal";

export default function CategoryPage() {
  const {
    data: categories,
    isLoading,
    isError,
    refetch,
  } = useGetAllCategories();
  const deleteCategory = useDeleteCategory();
  const [editing, setEditing] = useState<Category | null>(null);

  if (isLoading) return <LoadingSpinner label="Loading categories..." />;
  if (isError)
    return (
      <ErrorAlert message="Failed to load categories." onRetry={refetch} />
    );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Categories</h1>

      <CategoryForm />

      {!categories?.length ? (
        <EmptyState
          title="No categories yet"
          description="Add your first category above."
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {categories.map((category) => (
            <div key={category.id} className="card bg-base-200 p-4">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-4 w-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-semibold">{category.name}</span>
              </div>

              {category.isDefault ? (
                <span className="badge badge-neutral mt-2">Default</span>
              ) : (
                <div className="mt-2 flex gap-2">
                  <button
                    className="btn btn-xs"
                    onClick={() => setEditing(category)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-xs btn-error"
                    disabled={deleteCategory.isPending}
                    onClick={() => deleteCategory.mutate(category.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <EditCategoryModal category={editing} onClose={() => setEditing(null)} />
    </div>
  );
}
