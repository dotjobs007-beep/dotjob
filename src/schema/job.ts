import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  is_active: z.boolean().optional(),
  requirements: z
    .string()
    .min(10, "Requirements must be at least 10 characters"),
  category: z.string().min(2, "Category is required"),
  salary_token: z.string().min(2, "Salary token is required"),

  employment_type: z.enum([
    "full-time",
    "part-time",
    "contract",
    "internship",
    "temporary",
    "freelance",
  ]),

  work_arrangement: z.enum(["remote", "hybrid", "on-site"]),

  salary_type: z.enum(["hourly", "monthly", "yearly", "commission"]),

  salary_range: z
    .object({
      min: z.number().nonnegative().optional(),
      max: z.number().nonnegative().optional(),
    })
    .refine((data) => !data.min || !data.max || data.min <= data.max, {
      message: "Minimum salary must be less than or equal to maximum salary",
      path: ["max"],
    }),

  company_name: z.string().min(2, "Company name is required"),
  company_website: z.string().url("Invalid company website URL").optional(),
  company_description: z
    .string()
    .min(10, "Company description too short")
    .optional(),
  company_location: z.string().min(2, "Company location is required"),
  logo: z.string().optional(),
});

export const jobApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  resume: z.string().url("Resume must be a valid URL or file path"),
  // Applicant-provided fields
  fullName: z.string().min(2, "Full name is required"),
  contactMethod: z.enum(["email", "x", "telegram", "other"]),
  contactHandle: z.string().min(1, "Contact handle/link is required"),
  coverLetter: z
    .string()
    .min(10, "Cover letter must be at least 10 characters")
    .max(500, "Cover letter cannot exceed 500 characters")
    .optional(),
  polkadotExperience: z.boolean().optional(),
  polkadotDescription: z
    .string().or(z.literal(""))
    .optional(),
  portfolioLink: z
    .string()
    .url("Portfolio link must be a valid URL")
    .optional(),
  status: z.enum(["pending", "reviewing", "accepted", "rejected"]).optional(),
});
