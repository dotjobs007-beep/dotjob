import { IJob } from "../models/job.model";
import { IUser } from "../models/user.model";

export interface IJobFilters {
  minSalary?: number;
  maxSalary?: number;
  location?: string;
  companyName?: string;
  title?: string;
  employmentType?: string;
  workArrangement?: string;
  startDate?: Date;
  category?: string;
  endDate?: Date;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IPublicService {
  job?: IJobsDetails;
  user?: IUser[];
  page: number;
  limit: number;
  sortBy?: string;
}

export interface IJobsDetails {
  data : IJob[]
  pagination: {
    totalJobs: Number
    totalPages: Number
    currentPage: Number
    pageSize: Number
  }
}
