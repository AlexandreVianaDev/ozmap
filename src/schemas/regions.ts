import { z } from "zod";

export const regionCreateSchema = z.object({
  create: z.object({
    name: z.string(),
    user: z.string(),
    coordinates: z.object({
      type: z.string(),
      coordinates: z.array(z.array(z.array(z.number()))),
    }),
  }),
});

export const regionCompleteUpdateSchema = z.object({
  update: z.object({
    name: z.string(),
    user: z.string(),
    coordinates: z.object({
      type: z.string(),
      coordinates: z.array(z.array(z.array(z.number()))),
    }),
  }),
});

export const regionUpdateSchema = regionCompleteUpdateSchema.extend({
  update: regionCompleteUpdateSchema.shape.update.partial(),
});

export const regionGetNearSchema = z.object({
  lng: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => val >= -180 && val <= 180, {
      message: "Longitude deve estar entre -180 e 180.",
    }),
  lat: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => val >= -90 && val <= 90, {
      message: "Latitude deve estar entre -90 e 90.",
    }),
  distance: z.string(),
  user: z.string().optional(),
});

export const regionGetSchema = regionGetNearSchema.omit({
  distance: true,
  user: true,
});
