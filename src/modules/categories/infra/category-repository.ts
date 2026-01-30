import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/modules/categories/domain/category";

export interface CategoryRepository {
  listByRestaurant(restaurantId: string, query?: string): Promise<Category[]>;
  getById(id: string): Promise<Category | null>;
  create(input: CreateCategoryInput): Promise<Category>;
  update(id: string, input: UpdateCategoryInput): Promise<Category>;
  delete(id: string): Promise<void>;
}

