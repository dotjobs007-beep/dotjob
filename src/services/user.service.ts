import { DecodedIdToken } from "firebase-admin/auth";
import UserRepository from "../repositories/user.repo";
import AppError from "../utils/appError";
import { generateToken, logoutUser } from "../utils/tokenGenerator";
import { Response, Request } from "express";
import { IUpdateUser, searchParams } from "../interface/user.interface";
import { checkIdentitySubscan } from "../utils/verify_pokadot";

export default class UserService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async loginOrRegister(res: Response, firebaseUser: DecodedIdToken) {
    const { email, name, picture, phone_number, firebase, email_verified } =
      firebaseUser;
    const { sign_in_provider } = firebase;
    if (!email) {
      throw new AppError("Email not found in Firebase token", 400);
    }

    // Find or create user
    let user = await this.userRepo.findByEmail(email);
    if (!user) {
      user = await this.userRepo.create({
        email,
        name: name || "Anonymous",
        password: "",
        avatar: picture,
        email_verified: email_verified,
        authProvider: sign_in_provider,
        phoneNumber: phone_number,
      });
    }

    const token = generateToken(res, { id: user._id, role: user.role });

    return { user, token };
  }

  async fetchUserProfile(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user)
      throw new AppError("oops! something went wrong, please try again", 500);

    return user;
  }

  async updateUserProfile(userId: string, body: IUpdateUser) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError("Account not found", 404);
    if (body.about) user.about = body.about;
    if (body.phoneNumber) user.phoneNumber = body.phoneNumber;
    if (body.skills && body.skills.length > 0) user.skill = body.skills;
    if (body.avatar) user.avatar = body.avatar;
    if (body.name) user.name = body.name;

    // Validate profile links
    if (body.githubProfile){
      const isValidLink = this.validateProfileLink(body.githubProfile, 'github')
      if (!isValidLink) throw new AppError("Invalid GitHub profile link", 400);
      user.githubProfile = body.githubProfile;
    }

    // Validate profile links
    if (body.xProfile){
      const isValidLink = this.validateProfileLink(body.xProfile, 'x')
      if (!isValidLink) throw new AppError("Invalid Twitter profile link", 400);
      user.xProfile = body.xProfile;
    }

    // Validate profile links
    if (body.linkedInProfile){
      const isValidLink = this.validateProfileLink(body.linkedInProfile, 'linkedin')
      if (!isValidLink) throw new AppError("Invalid LinkedIn profile link", 400);
      user.linkedInProfile = body.linkedInProfile;
    }

    if (body.githubProfile) user.githubProfile = body.githubProfile;
    if (typeof body.jobSeeker === "boolean") user.jobSeeker = body.jobSeeker;
    if (body.location) user.location = body.location;
    if (body.gender) user.gender = body.gender;
    if (body.ethnicity) user.ethnicity = body.ethnicity;
    if (body.primaryLanguage) user.primaryLanguage = body.primaryLanguage;

    const response = await this.userRepo.update(userId, user);
    if (!response)
      throw new AppError("Oops! Something went wrong, please try again", 500);

    return response;
  }

  private validateProfileLink(url: string, platform: string): boolean {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname.replace("www.", "").toLowerCase();

      if (platform === "linkedin") {
        return hostname === "linkedin.com";
      }
      if (platform === "github") {
        return hostname === "github.com";
      }
      if (platform === "x") {
        return hostname === "x.com";
      }
      return false;
    } catch {
      return false;
    }
  }

  async connectWallet(req: Request) {
    const { address } = req.params;
    const { userId } = req;

    if (!userId) throw new AppError("Account not found", 401);

    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError("Account not found", 401);

    // ✅ Check if wallet is already connected to another account
    const existingUser = await this.userRepo.findUserByWalletAddress(address);
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new AppError("Wallet already connected to another account", 400);
    }

    // ✅ If already verified with same address, return early
    if (user.address === address && user.verified_onchain) {
      return { message: "Already verified" };
    }

    // ✅ Check on-chain identity
    const result = await checkIdentitySubscan(address);

    // Update address if different
    if (user.address !== address) user.address = address;

    // ✅ Determine onchain status
    user.onchain_status = this.getOnchainStatus(result?.judgements);
    user.verified_onchain = user.onchain_status === "Verified";

    // ✅ Save updates
    const response = await this.userRepo.update(userId, user);
    if (!response)
      throw new AppError("Oops! Something went wrong, please try again", 500);

    return { status: user.onchain_status };
  }

  /**
   * Helper to decide onchain status based on judgements.
   */
  private getOnchainStatus(judgements: any[] | undefined): string {
    if (!judgements || judgements.length === 0) return "Not Verified";

    const { judgement } = judgements[0];
    if (["Unknown", "FeePaid"].includes(judgement)) return "Pending";
    if (["Reasonable", "KnownGood"].includes(judgement)) return "Verified";
    return "Not Verified";
  }

  async logout(res: Response) {
    logoutUser(res);
    return;
  }

  async findAllUsers(req: Request) {
    const { userId } = req;
    if (!userId) throw new AppError("account not found", 401);
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError("account not found", 401);

    const params = req.query;

    const filter: searchParams = {
      name: params.name as string,
      email: params.email as string,
      address: params.address as string,
      jobSeeker: params.jobSeeker === "true" ? true : params.jobSeeker === "false" ? false : undefined,
      skills: params.skills ? (params.skills as string).split(",") : undefined,
      location: params.location as string,
      primaryLanguage: params.primaryLanguage as string,
      experienceLevel: params.experienceLevel as string,
      xProfile: params.xProfile as string,
      githubProfile: params.githubProfile as string,
      linkedInProfile: params.linkedInProfile as string,
      page: params.page ? Number(params.page) : 1,
      limit: params.limit ? Number(params.limit) : 10,
      sortBy: (params.sortBy as string) || "createdAt",
      sortOrder: (params.sortOrder as "asc" | "desc") || "desc",
    };

    return this.userRepo.findAllUsers(filter);
  }
}
