export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  ingredients: string[];
  restaurantId: string;
  menuCategoryId: string;
  menuCategoryName?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProductInput = {
  restaurantId: string;
  menuCategoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  ingredients: string[];
};

export type UpdateProductInput = Partial<CreateProductInput>;

