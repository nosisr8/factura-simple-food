"use server";

import { ConsumptionMethod, CustomerDocumentType } from "@prisma/client";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";

import { normalizeDocument } from "../helpers/document";

interface CreateOrderInput {
  customerName: string;
  customerDocument: string;
  documentType: CustomerDocumentType;
  tableNumber?: number | null;
  products: Array<{
    id: string;
    quantity: number;
  }>;
  consumptionMethod: ConsumptionMethod;
  slug: string;
}

export const createOrder = async (input: CreateOrderInput) => {
  const restaurant = await db.restaurant.findUnique({
    where: {
      slug: input.slug,
    },
  });
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }
  if (restaurant.catalogOnly) {
    throw new Error("Orders are disabled for this restaurant (catalog only)");
  }
  const productsWithPrices = await db.product.findMany({
    where: {
      id: {
        in: input.products.map((product) => product.id),
      },
    },
  });
  const productsWithPricesAndQuantities = input.products.map((product) => ({
    productId: product.id,
    quantity: product.quantity,
    price: productsWithPrices.find((p) => p.id === product.id)!.price,
  }));
  const order = await db.order.create({
    data: {
      status: "PENDING",
      customerName: input.customerName,
      customerDocument: normalizeDocument(input.customerDocument),
      documentType: input.documentType,
      tableNumber: input.tableNumber ?? null,
      confirmationToken: crypto.randomUUID(),
      orderProducts: {
        createMany: {
          data: productsWithPricesAndQuantities,
        },
      },
      total: productsWithPricesAndQuantities.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0,
      ),
      consumptionMethod: input.consumptionMethod,
      restaurantId: restaurant.id,
    },
  });
  revalidatePath(`/${input.slug}/orders`);
  // redirect(
  //   `/${input.slug}/orders?documentType=${input.documentType}&document=${normalizeDocument(input.customerDocument)}`,
  // );
  return order;
};
