import type {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from "@/modules/products/domain/product";

export interface ProductRepository {
  listByRestaurant(
    restaurantId: string,
    query?: string,
    categoryId?: string
  ): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  create(input: CreateProductInput): Promise<Product>;
  update(id: string, input: UpdateProductInput): Promise<Product>;
  delete(id: string): Promise<void>;
}

