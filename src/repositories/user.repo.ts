// src/repositories/user.repository.ts
import { searchParams } from "../interface/user.interface";
import User, { IUser } from "../models/user.model";

export default class UserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select("-password");
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id).select("-password");
  }

  async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(id);
  }

  async findUserByWalletAddress(address: string): Promise<IUser | null> {
    return await User.findOne({ address }).select("-password");
  }

  async findAllUsers(filter: searchParams): Promise<{
    data: IUser[];
    pagination: {
      totalUsers: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
    };
  }> {
    const page = filter.page || 1;
    const skip = (page - 1) * filter.limit!;
    const limit = filter.limit || 10;
    const sortBy = filter.sortBy || "createdAt";
    const sortOrder = filter.sortOrder || "desc";
    const sortOptions: any = { [sortBy]: sortOrder === "desc" ? -1 : 1 };
    const query: any = {};

    // Build an $or array if user wants to search across multiple fields (name OR email OR location OR skills)
    const orClauses: any[] = [];
    if (filter.name) {
      // If name looks like an email (contains @), treat it as an email search
      if (filter.name.includes("@")) {
        orClauses.push({ email: { $regex: filter.name, $options: "i" } });
      } else {
        orClauses.push({ name: { $regex: filter.name, $options: "i" } });
      }
    }
    if (filter.email) {
      orClauses.push({ email: { $regex: filter.email, $options: "i" } });
    }
    if (filter.location) {
      orClauses.push({ location: { $regex: filter.location, $options: "i" } });
    }
    if (filter.skills && filter.skills.length > 0) {
      // match any user who has at least one of the skills
      orClauses.push({ skills: { $in: filter.skills } });
    }

    if (orClauses.length > 0) {
      query.$or = orClauses;
    }
    if (filter.address) {
      query.address = { $regex: filter.address, $options: "i" };
    }
    if (filter.jobSeeker !== undefined) {
      query.jobSeeker = filter.jobSeeker;
    }
    if (filter.skills && filter.skills.length > 0) {
      query.skills = { $in: filter.skills };
    }
    if (filter.location) {
      query.location = { $regex: filter.location, $options: "i" };
    }
    if (filter.primaryLanguage) {
      query.primaryLanguage = { $regex: filter.primaryLanguage, $options: "i" };
    }
    if (filter.experienceLevel) {
      query.experienceLevel = filter.experienceLevel;
    }
    if (filter.ethnicity) {
      query.ethnicity = { $regex: filter.ethnicity, $options: "i" };
    }
    if (filter.location) {
      query.location = { $regex: filter.location, $options: "i" };
    }

    const users = await User.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    return {
      data: users,
      pagination: {
        totalUsers,
        currentPage: page,
        totalPages,
        pageSize: limit,
      },
    };
  }
}
