import { DecodedIdToken } from "firebase-admin/auth";
import UserRepository from "../repositories/user.repo";
import AppError from "../utils/appError";
import { generateToken, logoutUser } from "../utils/tokenGenerator";
import { Response, Request } from "express";
import { IUpdateUser } from "../interface/user.interface";
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

    const response = await this.userRepo.update(userId, user);
    if (!response)
      throw new AppError("Oops! Something went wrong, please try again", 500);

    return response;
  }

  async connectWallet(req: Request) {
    const { address } = req.params;
    const { userId } = req;

    if (!userId) throw new AppError("Account not found", 401);

    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError("Account not found", 401);

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
}
