import { prismaOpeningHoursRepository } from "@/modules/opening-hours/infra/prisma-opening-hours-repository";

export async function listOpeningHoursByRestaurant(restaurantId: string) {
  return prismaOpeningHoursRepository().listByRestaurant(restaurantId);
}

