export interface Expenses {
  id: string;
  amount: number;
  description: string;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseRequest {
  amount: number;
  description: string;
  categoryId: string;
  date: string;
}

export interface UpdateExpenseRequest {
  amount: number;
  description: string;
  categoryId: string;
  date: string;
}
