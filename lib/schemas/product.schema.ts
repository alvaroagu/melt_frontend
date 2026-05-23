import { z } from "zod";

export const createProductSchema = z.object({
  categoryId: z
    .number({ required_error: "La categoría es requerida" })
    .int()
    .positive(),
  name: z.string({ required_error: "El nombre es requerido" }).min(1).max(100),
  unitCost: z.preprocess((v) => {
    if (typeof v === "string") return parseFloat(v || "0");
    return v;
  }, z.number().min(0, { message: "El costo unitario debe ser >= 0" })),
  unitPrice: z.preprocess((v) => {
    if (typeof v === "string") return parseFloat(v || "0");
    return v;
  }, z.number().min(0, { message: "El precio unitario debe ser >= 0" })),
  currentStock: z.preprocess((v) => {
    if (typeof v === "string") return parseInt(v || "0", 10);
    return v;
  }, z.number().int().min(0, { message: "El stock debe ser un entero >= 0" })),
  trackInventory: z.boolean().optional().default(true),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
