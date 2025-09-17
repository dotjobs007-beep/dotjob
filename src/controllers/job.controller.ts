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
}
