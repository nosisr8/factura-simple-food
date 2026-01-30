export type Category = {
  id: string;
  name: string;
  order: number;
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCategoryInput = {
  restaurantId: string;
  name: string;
  order?: number;
};

export type UpdateCategoryInput = {
  name?: string;
  order?: number;
};

