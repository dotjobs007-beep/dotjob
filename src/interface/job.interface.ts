import { IJob } from "../models/job.model";

export interface IJobFilters {
  minSalary?: number;
  maxSalary?: number;
  location?: string;
  companyName?: string;
  title?: string;
  employmentType?: string;
  workArrangement?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
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
