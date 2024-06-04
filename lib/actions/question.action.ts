"use server";

import { connectToDatabase } from "./mongoose";

export async function createQuestion(params) {
  try {
    // connect to db
    connectToDatabase();
  } catch (error) {}
}
