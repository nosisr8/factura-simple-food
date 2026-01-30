import { prismaCategoryRepository } from "@/modules/categories/infra/prisma-category-repository";

export async function listCategoriesByRestaurant(restaurantId: string, query?: string) {
  return prismaCategoryRepository().listByRestaurant(restaurantId, query);
}

