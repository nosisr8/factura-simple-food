import type {
  CreateRestaurantInput,
  Restaurant,
  UpdateRestaurantInput,
} from "@/modules/restaurants/domain/restaurant";

export interface RestaurantRepository {
  list(query?: string): Promise<Restaurant[]>;
  getById(id: string): Promise<Restaurant | null>;
  create(input: CreateRestaurantInput): Promise<Restaurant>;
  update(id: string, input: UpdateRestaurantInput): Promise<Restaurant>;
  delete(id: string): Promise<void>;
}

