import { api } from "../baseApi";
import type {
  Categories,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/Categories";

export const categoryService = {
  getAllCategories: async (): Promise<Categories[]> => {
    const response = await api.get("/categories");
    return response.data;
  },

  createCategory: async (
    categoryData: CreateCategoryRequest,
  ): Promise<Categories> => {
    const response = await api.post("/categories", categoryData);
    return response.data;
  },

  updateCategory: async (
    categoryData: UpdateCategoryRequest,
  ): Promise<Categories> => {
    const response = await api.put("/categories", categoryData);
    return response.data;
  },

  deleteCategory: async (categoryId: string): Promise<void> => {
    await api.delete(`/categories/${categoryId}`);
  },
};
