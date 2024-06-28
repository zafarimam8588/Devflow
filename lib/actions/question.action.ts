"use server";

import Question from "@/databse/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/databse/tag.model";
import {
  CreateQuestionParams,
  GetQuestionByIdParams,
  QuestionVoteParams,
  getQuestionsParams,
} from "./shared.types";
import User from "@/databse/user.model";
import { revalidatePath } from "next/cache";

export async function createQuestion(params: CreateQuestionParams) {
  try {
    // connect to db
    await connectToDatabase();
    const { title, content, tags, author, path } = params;

    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    /**
      ---------new RegExp(^${tag}$, "i"): This creates a case-insensitive regular expression to match the tag name exactly (^ for start and $ for end of the string).
      
     --------$setOnInsert: This operator sets the specified fields in a new document if no document matches the filter (i.e., it will create a new tag with the given name if it does not exist).

     ---------upsert: true: If no document matches the filter, a new document will be created.

   
     */
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { question: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    // Update the question
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // Create an interaction recrod for the user's
    // ask_question action

    // Increment author's reputation by +5 points because
    // he created a question
    // revalidatePath allows you to purge cached data on-demand for a specific path.
    revalidatePath(path);
  } catch (error) {}
}

export async function getQuestions(params: getQuestionsParams) {
  try {
    await connectToDatabase();

    const questions = await Question.find({})
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .sort({ createdAt: -1 });

    return { questions };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();

    const { questionId } = params;

    const question = await Question.findById(questionId)
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });

    return question;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();

    const { questionId, userId, hasUpvoted, hasDownvoted, path } = params;

    let updateQuery = {};

    if (hasUpvoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasDownvoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found ");
    }

    // Increment author's reputation

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();

    const { questionId, userId, hasUpvoted, hasDownvoted, path } = params;

    let updateQuery = {};

    if (hasDownvoted) {
      updateQuery = { $pull: { downvoteQuestion: userId } };
    } else if (hasUpvoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error(" Question not found");
    }

    // Decrement author's reputation

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
