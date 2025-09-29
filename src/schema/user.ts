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
  linkedInProfile: z.string().url().or(z.literal("")).optional(),
  xProfile: z.string().url().or(z.literal("")).optional(),
  githubProfile: z.string().url().or(z.literal("")).optional(),
  jobSeeker: z.boolean().optional(),
  location: z.string().max(50).or(z.literal("")).optional(),
});
