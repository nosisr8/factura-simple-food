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
  whatsappUrl: z.string().trim().url("El WhatsApp debe ser una URL válida.").optional().nullable(),
  facebookUrl: z.string().trim().url("Facebook debe ser una URL válida.").optional().nullable(),
  instagramUrl: z.string().trim().url("Instagram debe ser una URL válida.").optional().nullable(),
  tiktokUrl: z.string().trim().url("TikTok debe ser una URL válida.").optional().nullable(),
  locationUrl: z.string().trim().url("Ubicación debe ser una URL válida.").optional().nullable(),
});

export const updateRestaurantSchema = createRestaurantSchema.partial();

