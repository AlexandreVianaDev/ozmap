import { z } from "zod";

export const userCreateSchema = z.object({
  create: z
    .object({
      name: z.string(),
      email: z.string().email(),
      address: z.string().optional(),
      coordinates: z.array(z.number()).optional(),
    })
    .refine((data) => data.address || data.coordinates, {
      message: "Forneça pelo menos um dos campos: address ou coordinates",
      path: ["address", "coordinates"],
    }),
});

export const userUpdateCompleteSchema = z.object({
  update: z
    .object({
      name: z.string(),
      email: z.string().email(),
      address: z.string().optional(),
      coordinates: z.array(z.number()).optional(),
    })
    .refine((data) => data.address || data.coordinates, {
      message: "Forneça pelo menos um dos campos: address ou coordinates",
      path: ["address", "coordinates"],
    }),
});

export const userUpdateSchema = z.object({
  update: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    coordinates: z.array(z.number()).optional(),
  }),
});
