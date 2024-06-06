"use server";

import Question from "@/databse/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/databse/tag.model";

export async function createQuestion(params) {
  try {
    // connect to db
    connectToDatabase();
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
  } catch (error) {}
}
