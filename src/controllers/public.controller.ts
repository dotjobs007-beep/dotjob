import { Request, Response } from "express";
import UserService from "../services/user.service";
import { sendResponse } from "../utils/responseHandler";
import AppError from "../utils/appError";
import { asyncHandler } from "../utils/asyncHandler";
import { IUpdateUser } from "../interface/user.interface";
import PublicService from "../services/public.service";

export default class PublicController {
  private publicService: PublicService;

  constructor() {
    this.publicService = new PublicService();
  }

  getAllJob = asyncHandler(async (req: Request, res: Response) => {
    const jobs = await this.publicService.getAllJob(req);
    return sendResponse(res, 200, "jobs fetched successful", jobs);
  });

  fetchUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await this.publicService.findAllUsers(req);
    return sendResponse(res, 200, "users fetched successful", users);
  });
}
