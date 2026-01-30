import { z } from "zod";

export const createCategorySchema = z.object({
  restaurantId: z.string().uuid("restaurantId inválido."),
  name: z.string().trim().min(1, "El nombre es requerido."),
  order: z.coerce.number().int().optional().default(0),
});

export const updateCategorySchema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido.").optional(),
  order: z.coerce.number().int().optional(),
});

