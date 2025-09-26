import mongoose, { Document, Schema } from "mongoose";

/* ===========================
   Job Model
=========================== */
export interface IJob extends Document {
  _id: string;
  creatorId: mongoose.Types.ObjectId;
  logo: string;
  title: string;
  description: string;
  employment_type: string;   // full-time, part-time, contract, internship
  work_arrangement: string;  // remote, hybrid, on-site
  salary_type: string;       // hourly, monthly, yearly, commission
  salary_range: {
    min: number;
    max: number;
  };
  company_name: string;
  company_website: string;
  company_description: string;
  company_location: string;
  is_active: boolean;
}

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    employment_type: { type: String, required: true },
    work_arrangement: { type: String, required: true },
    salary_type: { type: String, required: true },
    salary_range: {
      min: { type: Number },
      max: { type: Number },
    },
    company_name: { type: String, required: true },
    company_website: { type: String },
    company_description: { type: String },
    company_location: { type: String, required: true },
    logo: { type: String, default: "" },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Job = mongoose.model<IJob>("Job", jobSchema);

/* ===========================
   Job Application Model
=========================== */
export interface IJobApplication extends Document {
  _id: string;
  jobId: mongoose.Types.ObjectId;   
  applicantId: mongoose.Types.ObjectId; 
  resume: string;
  linkedInProfile: string;                    
  coverLetter?: string;
  xProfile: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  appliedAt: Date;
}

const jobApplicationSchema = new Schema<IJobApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    applicantId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    resume: { type: String, required: true },
    linkedInProfile: {type: String, default: ""},
    xProfile: {type: String, default: ""},
    status: {
      type: String,
      enum: ["pending", "reviewed", "accepted", "rejected"],
      default: "pending",
    },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const JobApplication = mongoose.model<IJobApplication>(
  "JobApplication",
  jobApplicationSchema
);
