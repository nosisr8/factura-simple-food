import { notFound } from "next/navigation";

import { db } from "@/lib/prisma";
import { computeOpenStatus } from "@/modules/opening-hours/application/open-status";

import RestaurantCategories from "./components/categories";
import RestaurantHeader from "./components/header";

interface RestaurantMenuPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ consumptionMethod?: string }>;
}

const isConsumptionMethodValid = (consumptionMethod: string) => {
  return ["DINE_IN", "TAKEAWAY"].includes(consumptionMethod.toUpperCase());
};

const RestaurantMenuPage = async ({
  params,
  searchParams,
}: RestaurantMenuPageProps) => {
  const { slug } = await params;
  const { consumptionMethod } = await searchParams;
  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    include: {
      openingHours: { orderBy: { dayOfWeek: "asc" } },
      menuCategories: {
        orderBy: { order: "asc" },
        include: { products: true },
      },
    },
  });
  if (!restaurant) {
    return notFound();
  }

  const openStatus = computeOpenStatus({
    timeZone: restaurant.timezone ?? "America/Asuncion",
    hours: restaurant.openingHours,
  });

  // Si el restaurante NO es solo catálogo, requiere método de consumo válido.
  if (!restaurant.catalogOnly) {
    if (!consumptionMethod || !isConsumptionMethodValid(consumptionMethod)) {
      return notFound();
    }
  }
  return (
    <div>
      <RestaurantHeader restaurant={restaurant} />
      <RestaurantCategories restaurant={restaurant} openStatus={openStatus} />
    </div>
  );
};

export default RestaurantMenuPage;

// http://localhost:3000/fsw-donalds/menu?consumptionMethod=dine_in