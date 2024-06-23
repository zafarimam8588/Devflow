"use server";
import User from "@/databse/user.model";
import { GetTopInteractedTagsParams } from "./shared.types";
import { connectToDatabase } from "../mongoose";

export async function getTopInterectedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    /**
     * Find interactions for the user and group by tags
     *
     */
    // TODO: Interactions...

    // Mock tags
    return [
      {
        _id: "1",
        name: "tag",
      },
      {
        _id: "2",
        name: "tag2",
      },
    ];
  } catch (error) {
    console.log("MongoDB connection failed", error);
    throw error;
  }
}
