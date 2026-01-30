import { createProductSchema } from "@/modules/products/application/product-schema";
import { prismaProductRepository } from "@/modules/products/infra/prisma-product-repository";

export async function createProduct(input: unknown) {
  const parsed = createProductSchema.parse(input);
  return prismaProductRepository().create(parsed);
}

