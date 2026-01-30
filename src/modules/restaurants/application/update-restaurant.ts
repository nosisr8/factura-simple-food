import { updateRestaurantSchema } from "@/modules/restaurants/application/restaurant-schema";
import { prismaRestaurantRepository } from "@/modules/restaurants/infra/prisma-restaurant-repository";

export async function updateRestaurant(id: string, input: unknown) {
  const parsed = updateRestaurantSchema.parse(input);
  return prismaRestaurantRepository().update(id, parsed);
}

