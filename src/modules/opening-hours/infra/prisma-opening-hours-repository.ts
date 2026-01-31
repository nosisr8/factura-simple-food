import type { RestaurantOpeningHour as PrismaRestaurantOpeningHour } from "@prisma/client";

import { db } from "@/lib/prisma";
import type { OpeningHour } from "@/modules/opening-hours/domain/opening-hour";
import type { OpeningHoursRepository } from "@/modules/opening-hours/infra/opening-hours-repository";

function toDomain(r: PrismaRestaurantOpeningHour): OpeningHour {
  return {
    id: r.id,
    restaurantId: r.restaurantId,
    dayOfWeek: r.dayOfWeek,
    isClosed: r.isClosed,
    opensAt: r.opensAt,
    closesAt: r.closesAt,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export function prismaOpeningHoursRepository(): OpeningHoursRepository {
  return {
    async listByRestaurant(restaurantId) {
      const rows = await db.restaurantOpeningHour.findMany({
        where: { restaurantId },
        orderBy: { dayOfWeek: "asc" },
      });
      return rows.map(toDomain);
    },
    async upsertWeek(restaurantId, week) {
      await db.$transaction(
        week.map((d) =>
          db.restaurantOpeningHour.upsert({
            where: { restaurantId_dayOfWeek: { restaurantId, dayOfWeek: d.dayOfWeek } },
            create: {
              restaurantId,
              dayOfWeek: d.dayOfWeek,
              isClosed: d.isClosed,
              opensAt: d.opensAt,
              closesAt: d.closesAt,
            },
            update: {
              isClosed: d.isClosed,
              opensAt: d.opensAt,
              closesAt: d.closesAt,
            },
          })
        )
      );

      const rows = await db.restaurantOpeningHour.findMany({
        where: { restaurantId },
        orderBy: { dayOfWeek: "asc" },
      });
      return rows.map(toDomain);
    },
  };
}

