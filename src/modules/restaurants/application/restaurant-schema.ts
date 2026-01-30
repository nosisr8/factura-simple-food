import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createRestaurantSchema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido."),
  slug: z
    .string()
    .trim()
    .min(1, "El slug es requerido.")
    .regex(slugRegex, "El slug debe ser kebab-case (ej: mi-restaurante)."),
  description: z.string().trim().min(1, "La descripción es requerida."),
  avatarImageUrl: z.string().trim().url("El avatar debe ser una URL válida."),
  coverImageUrl: z.string().trim().url("El cover debe ser una URL válida."),
  catalogOnly: z.boolean().optional().default(false),
  whatsappNumber: z.string().trim().optional().nullable(),
});

export const updateRestaurantSchema = createRestaurantSchema.partial();

