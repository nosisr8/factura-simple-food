"use server";

import { redirect } from "next/navigation";

import { requirePermission, requireRestaurantIdMatch } from "@/modules/admin/rbac";
import { upsertOpeningHoursWeek } from "@/modules/opening-hours/application/upsert-opening-hours-week";

export async function saveOpeningHoursWeekAction(
  restaurantId: string,
  formData: FormData
): Promise<void> {
  try {
    await requirePermission("restaurant:update");
    await requireRestaurantIdMatch(restaurantId);

    const week = Array.from({ length: 7 }).map((_, dayOfWeek) => {
      const prefix = `d${dayOfWeek}`;
      return {
        restaurantId,
        dayOfWeek,
        isClosed: formData.get(`${prefix}.isClosed`) === "on",
        opensAt: String(formData.get(`${prefix}.opensAt`) ?? "09:00"),
        closesAt: String(formData.get(`${prefix}.closesAt`) ?? "18:00"),
      };
    });

    await upsertOpeningHoursWeek(restaurantId, week);
  } catch {
    // Si querés errores inline, lo pasamos a useActionState en un Client Component.
  }

  redirect(`/admin/restaurants/${restaurantId}/hours`);
}

