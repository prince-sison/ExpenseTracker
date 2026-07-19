export interface Expenses {
  id: string;
  amount: number;
  description: string;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  date: string; // ISO 8601 format
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
}
