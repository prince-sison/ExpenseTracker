import { baseApiProvider as api } from "../baseApi";
import { buildPath, Routes } from "../types/routes";
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/Categories";

export const categoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    const url = buildPath(Routes.getAllCategories);
    const response = await api.get(url);
    return response.data;
  },

  createCategory: async (
    categoryData: CreateCategoryRequest,
  ): Promise<Category> => {
    const url = buildPath(Routes.createCategory);
    const response = await api.post(url, categoryData);
    return response.data;
  },

  updateCategory: async (
    categoryData: UpdateCategoryRequest,
  ): Promise<Category> => {
    const url = buildPath(Routes.updateCategory);
    const response = await api.put(url, categoryData);
    return response.data;
  },

  deleteCategory: async (categoryId: string): Promise<void> => {
    const url = buildPath(Routes.deleteCategory, { categoryId });
    await api.delete(url);
  },
};
