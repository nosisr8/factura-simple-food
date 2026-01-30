import { updateProductSchema } from "@/modules/products/application/product-schema";
import { prismaProductRepository } from "@/modules/products/infra/prisma-product-repository";

export async function updateProduct(id: string, input: unknown) {
  const parsed = updateProductSchema.parse(input);
  return prismaProductRepository().update(id, parsed);
}

