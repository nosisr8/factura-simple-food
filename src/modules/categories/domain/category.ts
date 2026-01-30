export type Category = {
  id: string;
  name: string;
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCategoryInput = {
  restaurantId: string;
  name: string;
};

export type UpdateCategoryInput = {
  name?: string;
};

