export interface Categories {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  color: string;
}

export interface UpdateCategoryRequest {
  id: string;
  name: string;
  color: string;
}
