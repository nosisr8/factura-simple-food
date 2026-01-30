import { prismaProductRepository } from "@/modules/products/infra/prisma-product-repository";

export async function getProductById(id: string) {
  return prismaProductRepository().getById(id);
}

