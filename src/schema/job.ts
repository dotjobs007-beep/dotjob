import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  
  employment_type: z.enum([
    "full-time",
    "part-time",
    "contract",
    "internship",
    "temporary",
    "freelance",
  ]),
  
  work_arrangement: z.enum([
    "remote",
    "hybrid",
    "on-site",
  ]),
  
  salary_type: z.enum([
    "hourly",
    "monthly",
    "yearly",
    "commission",
  ]),
  
  salary_range: z.object({
    min: z.number().nonnegative().optional(),
    max: z.number().nonnegative().optional(),
  }).refine(data => !data.min || !data.max || data.min <= data.max, {
    message: "Minimum salary must be less than or equal to maximum salary",
    path: ["max"],
  }),
  
  company_name: z.string().min(2, "Company name is required"),
  company_website: z.string().url("Invalid company website URL").optional(),
  company_description: z.string().min(10, "Company description too short").optional(),
  company_location: z.string().min(2, "Company location is required"),
  logo: z.string().optional(),
});
