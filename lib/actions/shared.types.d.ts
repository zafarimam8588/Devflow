import { IUser } from "@/databse/user.model";
import { Schema } from "mongoose";

export interface getQuestionsParams {
  page?: string;
  pageSize?: string;
  searchQuery?: string;
  filter?: string;
}

export interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
  author: Schema.Types.ObjectId | IUser;
  path: string;
}
