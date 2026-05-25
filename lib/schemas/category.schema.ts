import { z } from "zod"

import { requiredText } from "./shared"

export const createCategorySchema = z.object({
  name: requiredText("El nombre", 50),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>

