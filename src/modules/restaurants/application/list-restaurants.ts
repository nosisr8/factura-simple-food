import { prismaRestaurantRepository } from "@/modules/restaurants/infra/prisma-restaurant-repository";

export async function listRestaurants(query?: string) {
  return prismaRestaurantRepository().list(query);
}

