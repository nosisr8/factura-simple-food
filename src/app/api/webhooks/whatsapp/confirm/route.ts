import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { db } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("orderId");
  const token = url.searchParams.get("token");

  if (!orderId || !token) {
    return NextResponse.json({ ok: false, error: "Missing params" }, { status: 400 });
  }

  const order = await db.order.findUnique({
    where: { id: Number(orderId) },
    include: {
      restaurant: { select: { slug: true } },
    },
  });

  if (!order || !order.confirmationToken || order.confirmationToken !== token) {
    return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 403 });
  }

  await db.order.update({
    where: { id: order.id },
    data: {
      status: "PAYMENT_CONFIRMED",
      confirmedAt: new Date(),
    },
  });

  revalidatePath(`/${order.restaurant.slug}/menu`);
  revalidatePath(`/${order.restaurant.slug}/orders`);

  const redirectUrl = new URL(
    `/${order.restaurant.slug}/orders?documentType=${order.documentType}&document=${order.customerDocument}&confirmed=1`,
    request.url,
  );
  return NextResponse.redirect(redirectUrl);
}

