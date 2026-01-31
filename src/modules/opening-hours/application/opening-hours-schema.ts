import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export const upsertOpeningHourSchema = z.object({
  restaurantId: z.string().uuid("restaurantId inválido."),
  dayOfWeek: z.coerce
    .number()
    .int()
    .min(0, "Día inválido.")
    .max(6, "Día inválido."),
  isClosed: z.coerce.boolean(),
  opensAt: z.string().regex(timeRegex, "Hora 'desde' inválida (HH:mm)."),
  closesAt: z.string().regex(timeRegex, "Hora 'hasta' inválida (HH:mm)."),
});

export const upsertOpeningHoursWeekSchema = z.array(upsertOpeningHourSchema).length(7);

