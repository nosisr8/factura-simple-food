import { prismaRestaurantRepository } from "@/modules/restaurants/infra/prisma-restaurant-repository";

export async function getRestaurantById(id: string) {
  return prismaRestaurantRepository().getById(id);
}

