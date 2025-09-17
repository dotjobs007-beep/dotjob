import { Request, Response } from "express";
import { sendResponse } from "../utils/responseHandler";
import { asyncHandler } from "../utils/asyncHandler";
import JobService from "../services/job.service";

export default class JobController {
  private jobService: JobService;

  constructor() {
    this.jobService = new JobService();
  }

  postJob = asyncHandler(async (req: Request, res: Response) => {
    await this.jobService.postJob(req);
    return sendResponse(res, 200, "job created successful");
  });

  getAllJob = asyncHandler(async (req: Request, res: Response) => {
    const jobs = await this.jobService.getAllJob(req);
    return sendResponse(res, 200, "jobs fetched successful", jobs);
  });

  getJob = asyncHandler(async (req: Request, res: Response) => {
    const job = await this.jobService.getJobById(req);
    return sendResponse(res, 200, "job fetched successful", job);
  });

  getUserJob = asyncHandler(async (req: Request, res: Response) => {
    const jobs = await this.jobService.getUserJobs(req);
    return sendResponse(res, 200, "job fetched successful", jobs);
  });

  updateJob = asyncHandler(async (req: Request, res: Response) => {
    await this.jobService.updateJob(req);
    return sendResponse(res, 200, "job updated successful");
  });

  applyForJob = asyncHandler(async (req: Request, res: Response) => {
    await this.jobService.applyForJob(req);
    return sendResponse(res, 200, "job applied successful");
  });

  getApplicationsForJob = asyncHandler(async (req: Request, res: Response) => {
    const jobs = await this.jobService.getApplicationsForJob(req);
    return sendResponse(res, 200, "job applications fetched successful", jobs);
  });

  updateApplicationStatus = asyncHandler(async (req: Request, res: Response) => {
    await this.jobService.getApplicationsForJob(req);
    return sendResponse(res, 200, "job applications updated successful");
  });
}
