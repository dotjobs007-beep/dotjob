import AppError from "../utils/appError";
import { Request } from "express";
import JobRepository from "../repositories/job.repo";
import UserRepository from "../repositories/user.repo";
import { IJob } from "../models/job.model";
import mongoose from "mongoose";
import { IJobFilters } from "../interface/job.interface";
import formidable, { File } from "formidable";
import fs from "fs";
// import { cloud } from "../config/cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
      employment_type: body.employment_type,
      work_arrangement: body.work_arrangement,
      salary_type: body.salary_type,
      salary_range: body.salary_range,
      company_name: body.company_name,
      company_website: body.company_website,
      company_description: body.company_description,
      company_location: body.company_location,
      is_active: body.is_active !== undefined ? body.is_active : true,
      requirements: body.requirements,
      logo: body.logo,
      category: body.category,
      salary_token: body.salary_token,
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

  async applyForJob(req: Request) {
    const { userId } = req;
    if (!userId) throw new AppError("account not found", 401);

    const { jobId, resume, linkedInProfile, xProfile, coverLetter } = req.body;

    // Ensure job exists
    const job = await this.jobRepo.getJobById(jobId);
    if (!job || !job.is_active) throw new AppError("job not available", 404);

    const alreadyApplied = await this.jobRepo.getApplicationByUserId(
      jobId,
      userId
    );
    if (alreadyApplied) throw new AppError("can't re-apply for this job", 500);

    const application = await this.jobRepo.applyForJob({
      jobId,
      applicantId: new mongoose.Types.ObjectId(userId),
      resume,
      linkedInProfile,
      xProfile,
      coverLetter,
    });

    return application;
  }

  // Get applications for a job
  async getApplicationsForJob(req: Request) {
    const { userId } = req;
    if (!userId) throw new AppError("account not found", 401);

    const { jobId } = req.params;
    const { page = 1, limit = 10, sortBy, sortOrder } = req.query;

    // Ensure job exists
    const job = await this.jobRepo.getJobById(jobId);
    if (!job) throw new AppError("job not found", 404);

    // Only creator can fetch applications
    console.log(job.creatorId.toString(), userId.toString());
    if (job.creatorId.toString() !== userId.toString()) {
      throw new AppError("not authorized", 403);
    }

    return this.jobRepo.getApplicationsByJobId(
      jobId,
      Number(page),
      Number(limit),
      (sortBy as string) || "createdAt",
      (sortOrder as "asc" | "desc") || "desc"
    );
  }

  // Update application status
  async updateApplicationStatus(req: Request) {
    const { userId } = req;
    if (!userId) throw new AppError("account not found", 401);

    const { applicationId } = req.params;
    const { status } = req.params;
    if (!applicationId) throw new AppError("application id is required", 500);
    if (!status) throw new AppError("status is required", 500);

    if (!["pending", "reviewed", "accepted", "rejected"].includes(status)) {
      throw new AppError("invalid status value", 400);
    }

    const updated = await this.jobRepo.updateApplicationStatus(
      applicationId,
      status as "pending" | "reviewed" | "accepted" | "rejected"
    );
    if (!updated) throw new AppError("application not found", 404);

    return updated;
  }

  async uploadResume(req: Request): Promise<string> {
    // Create a new formidable form
    const form = formidable({ multiples: false });
    try {
      const { files } = await new Promise<{ files: formidable.Files }>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) return reject(err);
          resolve({ files });
        });
      });
      // Ensure a file exists
      if (!files.file) {
        throw new AppError("No file uploaded", 400);
      }

      // Narrow type to a single file
      const file = Array.isArray(files.file) ? files.file[0] : (files.file as formidable.File);

      if (!file.filepath || !file.originalFilename) {
        throw new AppError("Invalid file", 400);
      }

      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(file.filepath, {
        folder: "resumes",   
        resource_type: "auto", 
        use_filename: true,
        unique_filename: false,
      });

      // Remove temp file
      fs.unlink(file.filepath, (err) => {
        if (err) console.warn("Failed to delete temp file:", err);
      });
      return uploadResult.secure_url;

    } catch (error: any) {
      throw new AppError(error.message || "Failed to upload resume", 500);
    }
  }
}
