import AppError from "../utils/appError";
import { Request } from "express";
import JobRepository from "../repositories/job.repo";
import UserRepository from "../repositories/user.repo";
import { IJob } from "../models/job.model";
import mongoose from "mongoose";
import { IJobFilters } from "../interface/job.interface";

export default class JobService {
  private jobRepo: JobRepository;
  private userRepo: UserRepository;

  constructor() {
    this.jobRepo = new JobRepository();
    this.userRepo = new UserRepository();
  }

  async postJob(req: Request) {
    const { userId } = req;
    if (!userId) throw new AppError("account not found", 401);
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError("account not found", 401);
    if (!user.verified_onchain)
      throw new AppError("polkadot identity not verified", 500);

    const body: IJob = req.body;

    const newJob = await this.jobRepo.create({
      title: body.title,
      creatorId: new mongoose.Types.ObjectId(userId),
      description: body.description,
      position: body.position,
      employment_type: body.employment_type,
      work_arrangement: body.work_arrangement,
      salary_type: body.salary_type,
      salary_range: body.salary_range,
      company_name: body.company_name,
      company_website: body.company_website,
      company_description: body.company_description,
      company_location: body.company_location,
      is_active: body.is_active !== undefined ? body.is_active : true,
      logo: body.logo,
    });
    if (!newJob)
      throw new AppError("oops! something went wrong, please try again", 500);
    return;
  }

  async getAllJob(req: Request) {
    const { userId } = req;
    if (!userId) throw new AppError("account not found", 401);

    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError("account not found", 401);

    // Extract filters from query
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
      page,
      limit,
      sortBy,
    } = req.query;

    // Build filter object, converting types where necessary
    const filters: IJobFilters = {
      minSalary: minSalary ? Number(minSalary) : undefined,
      maxSalary: maxSalary ? Number(maxSalary) : undefined,
      location: location as string | undefined,
      companyName: companyName as string | undefined,
      title: title as string | undefined,
      employmentType: employmentType as string | undefined,
      workArrangement: workArrangement as string | undefined,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      sortBy: (sortBy as string) || "createdAt",
    };

    // Pass filters to repo
    const jobs = await this.jobRepo.getAllJobs(filters);
    if (!jobs)
      throw new AppError("oops! something went wrong, please try again", 500);

    return jobs;
  }

  async getJobById(req: Request) {
    const { userId } = req;
    const { jobId } = req.params;
    if (!userId) throw new AppError("account not found", 401);

    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError("account not found", 401);
    if (!jobId) throw new AppError("job id is required", 500);

    const job = await this.jobRepo.getJobById(jobId);
    return job;
  }

  async getUserJobs(req: Request) {
    const { userId } = req;
    if (!userId) throw new AppError("account not found", 401);
    const { page, limit, sortBy } = req.query;
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError("account not found", 401);
    const pageInt = page ? Number(page) : 1;
    const limitInt = limit ? Number(limit) : 10;
    const sortByFormatted = (sortBy as string) || "createdAt";
    const sortOrderFormatted = "desc";
    const job = await this.jobRepo.getJobsByUser(
      userId,
      pageInt,
      limitInt,
      sortByFormatted,
      sortOrderFormatted
    );
    return job;
  }

  async updateJob(req: Request) {
    const { userId } = req;
    if (!userId) throw new AppError("account not found", 401);
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError("account not found", 401);
    const { jobId } = req.params;
    if (!jobId) throw new AppError("job id is required", 500);
    const body: IJob = req.body;
    const update = await this.jobRepo.updateJob(jobId, userId, body);
    if (!update)
      throw new AppError("oops! something went wrong, please try again", 500);
    return;
  }
}
