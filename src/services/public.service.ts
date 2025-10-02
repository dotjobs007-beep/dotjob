import AppError from "../utils/appError";
import { Request } from "express";
import JobRepository from "../repositories/job.repo";
import UserRepository from "../repositories/user.repo";
import { IJobFilters, IPublicService } from "../interface/job.interface";
import dotenv from "dotenv";
import { searchParams } from "../interface/user.interface";

dotenv.config();

export default class PublicService {
  private jobRepo: JobRepository;
  private userRepo: UserRepository;

  constructor() {
    this.jobRepo = new JobRepository();
    this.userRepo = new UserRepository();
  }

  async getAllJob(req: Request) {
    // Extract filters from query
    const { companyName, title, page, limit, sortBy } = req.query;

    // Build filter object, converting types where necessary
    const filters: IJobFilters = {
      companyName: companyName as string | undefined,
      title: title as string | undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      sortBy: (sortBy as string) || "createdAt",
    };

    // Pass filters to repo
    const jobs = await this.jobRepo.publicJobs(filters);
    if (!jobs)
      throw new AppError("oops! something went wrong, please try again", 500);

    const data: IPublicService = {
      job: jobs, 
      page: Number(jobs.pagination.currentPage),
      limit: Number(jobs.pagination.pageSize),
      sortBy: filters.sortBy,
    }
    return data;
  }

  async findAllUsers(req: Request) {
    const params = req.query;

    const filter: searchParams = {
      name: params.name as string,
      page: params.page ? Number(params.page) : 1,
      limit: params.limit ? Number(params.limit) : 10,
      sortBy: (params.sortBy as string) || "createdAt",
      sortOrder: (params.sortOrder as "asc" | "desc") || "desc",
    };

    const { data: users, pagination } = await this.userRepo.findAllUsers(
      filter
    );
    const data: IPublicService = {
      user: users,
      page: Number(pagination.currentPage),
      limit: Number(pagination.pageSize),
      sortBy: filter.sortBy,
    };
    return data;
  }
}
