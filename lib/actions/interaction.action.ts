"use server";

import Question from "@/databse/question.model";
import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/databse/interaction.model";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    // VIEWS INCREASING DOUBLE INSTEAD OF ONE
    await connectToDatabase();

    const { questionId, userId } = params;

    // Update view count for the question the user viewing
    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });

      if (existingInteraction) {
        console.log("👁️‍🗨️ User has already viewed this question 👁️‍🗨️");
        return;
      }

      // Create interaction
      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
      });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
