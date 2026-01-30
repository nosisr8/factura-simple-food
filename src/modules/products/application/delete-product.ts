import { prismaProductRepository } from "@/modules/products/infra/prisma-product-repository";

export async function deleteProduct(id: string) {
  await prismaProductRepository().delete(id);
}

