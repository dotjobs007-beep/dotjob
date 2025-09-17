// src/repositories/job.repository.ts
import  { IJob, Job, JobApplication, IJobApplication } from "../models/job.model";
import { IJobFilters, IJobsDetails } from "../interface/job.interface";

export default class JobRepository {
  // Create a job
  async create(jobData: Partial<IJob>): Promise<IJob> {
    const job = new Job(jobData);
    return await job.save();
  }

  // Get all jobs with filters, pagination, sorting
  async getAllJobs(filters: IJobFilters = {}): Promise<IJobsDetails> {
    const {
      minSalary,
      maxSalary,
      location,
      companyName,
      title,
      employmentType,
      workArrangement,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters;

    const query: any = { is_active: true };

    if (minSalary !== undefined) query["salary_range.min"] = { $gte: minSalary };
    if (maxSalary !== undefined) query["salary_range.max"] = { $lte: maxSalary };
    if (location) query.company_location = { $regex: location, $options: "i" };
    if (companyName) query.company_name = { $regex: companyName, $options: "i" };
    if (title) query.title = { $regex: title, $options: "i" };
    if (employmentType) query.employment_type = employmentType;
    if (workArrangement) query.work_arrangement = workArrangement;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }

    const skip = (page - 1) * limit;
    const sortOptions: any = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const jobs = await Job.find(query).sort(sortOptions).skip(skip).limit(limit);
    const totalJobs = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / limit);

    return {
      data: jobs,
      pagination: {
        totalJobs,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    };
  }

  // Get a single job by ID
  async getJobById(id: string): Promise<IJob | null> {
    return Job.findById(id);
  }

  // Update a job by ID
  async updateJob(id: string, creatorId:string, updateData: Partial<IJob>): Promise<IJob | null> {
    return Job.findByIdAndUpdate({_id:id, creatorId:creatorId}, updateData, { new: true });
  }

  // Deactivate a job (set is_active to false)
  async deactivateJob(id: string): Promise<IJob | null> {
    return Job.findByIdAndUpdate(id, { is_active: false }, { new: true });
  }

  // Delete a job permanently
  async deleteJob(id: string): Promise<IJob | null> {
    return Job.findByIdAndDelete(id);
  }

  async getJobsByUser(userId: string, page = 1, limit = 10, sortBy = "createdAt", sortOrder: "desc"): Promise<IJobsDetails> {
  const query = { creatorId: userId };

  const skip = (page - 1) * limit;
  const sortOptions: any = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  const jobs = await Job.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const totalJobs = await Job.countDocuments(query);
  const totalPages = Math.ceil(totalJobs / limit);

  return {
    data: jobs,
    pagination: {
      totalJobs,
      totalPages,
      currentPage: page,
      pageSize: limit,
    },
  };
}

}
