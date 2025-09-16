// src/repositories/user.repository.ts
import User, { IUser } from "../models/user.model";

export default class UserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(id);
  }
}
