import mongoose, { Document, Schema } from "mongoose";
import { UserRole } from "../utils/enum";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  authProvider: string;
  verified_onchain: boolean;
  about: string;
  avatar: string;
  email_verified: boolean;
  phoneNumber: string;
  skill: string[];
  address: string;
  onchain_status: string;
  linkedInProfile?: string;
  xProfile?: string;
  githubProfile?: string;
  jobSeeker: boolean;
  location?: string;
  gender?: string;
  ethnicity?: string;
  primaryLanguage?: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    role: { type: String, default: UserRole.Viewer },
    verified_onchain: { type: Boolean, default: false },
    avatar: { type: String, default: "" },
    authProvider: { type: String, required: true },
    email_verified: { type: Boolean, required: true },
    phoneNumber: { type: String, default: "" },
    about: { type: String, default: "" },
    skill: { type: [String], default: [] },
    address: {type: String, default: ""},
    onchain_status: {type: String, required: false},
    linkedInProfile: { type: String, required: "" },
    xProfile: { type: String, required: "" },
    githubProfile: { type: String, required: "" },
    jobSeeker: { type: Boolean, default: true },
    location: { type: String, required: "" },
    gender: { type: String, required: "" },
    ethnicity: { type: String, required: "" },
    primaryLanguage: { type: String, required: "" },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
