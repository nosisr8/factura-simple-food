import { prismaRestaurantRepository } from "@/modules/restaurants/infra/prisma-restaurant-repository";

export async function deleteRestaurant(id: string) {
  await prismaRestaurantRepository().delete(id);
}

