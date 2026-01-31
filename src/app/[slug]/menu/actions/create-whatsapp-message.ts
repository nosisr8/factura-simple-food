"use server";

import { ConsumptionMethod, CustomerDocumentType } from "@prisma/client";
import { headers } from "next/headers";

import { formatCurrency } from "@/helpers/format-currency";
import { db } from "@/lib/prisma";

import { normalizeDocument } from "../helpers/document";

interface CreateWhatsappMessageInput {
  orderId: number;
  slug: string;
  consumptionMethod: ConsumptionMethod;
  documentType: CustomerDocumentType;
  document: string;
}

export const createWhatsappMessage = async ({
  orderId,
  slug,
  consumptionMethod,
  documentType,
  document,
}: CreateWhatsappMessageInput) => {
  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    select: { whatsappUrl: true, name: true },
  });
  if (!restaurant?.whatsappUrl) {
    throw new Error("Missing restaurant WhatsApp url");
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      orderProducts: { include: { product: true } },
    },
  });
  if (!order?.confirmationToken) {
    throw new Error("Order not found or missing confirmation token");
  }

  const origin = (await headers()).get("origin") as string;
  const confirmUrl = `${origin}/api/webhooks/whatsapp/confirm?orderId=${orderId}&token=${order.confirmationToken}`;

  const normalizedDocument = normalizeDocument(document);
  const consumptionLabel =
    consumptionMethod === "DINE_IN" ? "Para comer acá" : "Para llevar";

  const mesaLine =
    consumptionMethod === "DINE_IN" && order.tableNumber
      ? `Mesa: ${order.tableNumber}`
      : null;

  const detalle = order.orderProducts
    .map((op) => {
      const unitPrice = op.price;
      const subtotal = op.price * op.quantity;
      return `- ${op.quantity}x ${op.product.name} — ${formatCurrency(unitPrice)} c/u (${formatCurrency(subtotal)})`;
    })
    .join("\n");

  const message = [
    `Nuevo pedido #${orderId} (${restaurant.name})`,
    `Cliente: ${order.customerName}`,
    `Documento: ${documentType} ${normalizedDocument}`,
    `Consumo: ${consumptionLabel}`,
    ...(mesaLine ? [mesaLine] : []),
    "",
    "Detalle:",
    detalle || "- (sin detalle)",
    "",
    `Total: ${formatCurrency(order.total)}`,
    "",
    `Confirmar pedido: ${confirmUrl}`,
  ].join("\n");

  // Link universal (sirve para abrir WhatsApp Web/App con el texto)
  const whatsappUrl = `${restaurant.whatsappUrl}?text=${encodeURIComponent(message)}`;

  // Texto/payload base para WhatsApp Business Cloud API (si luego lo integrás)
  const whatsappApiPayload = {
    messaging_product: "whatsapp",
    to: "",
    type: "text",
    text: { body: message },
  };

  return { whatsappUrl, message, whatsappApiPayload };
};

