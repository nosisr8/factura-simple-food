import { createRestaurantSchema } from "@/modules/restaurants/application/restaurant-schema";
import { prismaRestaurantRepository } from "@/modules/restaurants/infra/prisma-restaurant-repository";

export async function createRestaurant(input: unknown) {
  const parsed = createRestaurantSchema.parse(input);
  return prismaRestaurantRepository().create(parsed);
}

