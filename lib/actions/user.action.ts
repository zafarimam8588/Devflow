"use server";
import User from "@/databse/user.model";
import { connectToDatabase } from "../mongoose";

export async function getUserbyId(params: any) {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
