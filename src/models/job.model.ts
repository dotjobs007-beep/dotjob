import mongoose, { Document, Schema } from "mongoose";

export interface IJob extends Document {
  _id: string;
  creatorId: mongoose.Types.ObjectId;
  logo: string;
  title: string;
  description: string;
  position: string;
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
  is_active: boolean
}

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },

    // Foreign key reference to User collection
    creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    description: { type: String, required: true },
    position: { type: String, required: true },
    employment_type: { type: String, required: true }, // e.g. "full-time"
    work_arrangement: { type: String, required: true }, // e.g. "remote"
    salary_type: { type: String, required: true }, // e.g. "monthly"
    salary_range: {
      min: { type: Number, required: false },
      max: { type: Number, required: false },
    },
    company_name: { type: String, required: true },
    company_website: { type: String, required: false },
    company_description: { type: String, required: false },
    company_location: { type: String, required: true },
    logo: {type: String, default: ""},
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);


export default mongoose.model<IJob>("Job", jobSchema);
