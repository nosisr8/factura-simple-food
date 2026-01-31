import { upsertOpeningHoursWeekSchema } from "@/modules/opening-hours/application/opening-hours-schema";
import { prismaOpeningHoursRepository } from "@/modules/opening-hours/infra/prisma-opening-hours-repository";

export async function upsertOpeningHoursWeek(restaurantId: string, input: unknown) {
  const parsed = upsertOpeningHoursWeekSchema.parse(input);
  return prismaOpeningHoursRepository().upsertWeek(restaurantId, parsed);
}

