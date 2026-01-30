import { z } from "zod";

export const createProductSchema = z.object({
  restaurantId: z.string().uuid("restaurantId inválido."),
  menuCategoryId: z.string().uuid("menuCategoryId inválido."),
  name: z.string().trim().min(1, "El nombre es requerido."),
  description: z.string().trim().optional().default(""),
  price: z.coerce.number().positive("El precio debe ser mayor a 0."),
  imageUrl: z.string().trim().url("La imagen debe ser una URL válida."),
  ingredients: z.array(z.string().trim()).default([]),
});

export const updateProductSchema = createProductSchema.partial();

