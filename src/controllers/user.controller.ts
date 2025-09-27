import { Request, Response } from "express";
import UserService from "../services/user.service";
import { sendResponse } from "../utils/responseHandler";
import AppError from "../utils/appError";
import { asyncHandler } from "../utils/asyncHandler";
import { IUpdateUser } from "../interface/user.interface";

export default class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  loginOrRegister = asyncHandler(async (req: Request, res: Response) => {
    const firebaseUser = req.user;
    if (!firebaseUser) {
      throw new AppError("No Firebase user found in request", 400);
    }

    const user = await this.userService.loginOrRegister(res, firebaseUser);
    return sendResponse(res, 200, "Login/Register successful", user);
  });

  fetchUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) {
      throw new AppError("unauthorised", 401);
    }

    const user = await this.userService.fetchUserProfile(userId);
    return sendResponse(res, 200, "user profile fetched successful", user);
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) {
      throw new AppError("unauthorised", 401);
    }

    const body: IUpdateUser = req.body;
    await this.userService.updateUserProfile(userId, body);
    return sendResponse(res, 200, "user updated successful");
  });

  connectWallet = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) {
      throw new AppError("unauthorised", 401);
    }
    await this.userService.connectWallet(req);
    return sendResponse(res, 200, "wallet connect successful");
  });

    logout = asyncHandler(async (req: Request, res: Response) => {
    await this.userService.logout(res);
    return sendResponse(res, 200, "logout successful");
  });
}
