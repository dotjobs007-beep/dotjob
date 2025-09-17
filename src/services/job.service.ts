import AppError from "../utils/appError";
import { Request } from "express";
import JobRepository from "../repositories/job.repo";
import UserRepository from "../repositories/user.repo";
import { IJob } from "../models/job.model";
import mongoose from "mongoose";

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
}
