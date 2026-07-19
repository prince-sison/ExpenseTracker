export interface Budgets {
  id: string;
  limitAmount: number;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  month: number;
  year: number;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
}
