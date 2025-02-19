import { z } from "zod";

export const CreateSchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string()
})