import { prismaProductRepository } from "@/modules/products/infra/prisma-product-repository";

export async function listProductsByRestaurant(
  restaurantId: string,
  opts?: { q?: string; categoryId?: string }
) {
  return prismaProductRepository().listByRestaurant(
    restaurantId,
    opts?.q,
    opts?.categoryId
  );
}

