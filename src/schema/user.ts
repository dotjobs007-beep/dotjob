import { z } from "zod";
const phoneSchema = z.string().regex(/^\+?\d{10,15}$/, {
  message: "Invalid phone number",
});
export const updateSchema = z.object({
  about: z.string().min(10).max(100).optional(),
  phoneNumber: phoneSchema.optional(),
  skills: z.array(z.string()).optional(),
  avatar: z.string().url().optional(),
  name: z.string().min(3).max(30).optional(),
});
