"use server";
import User from "@/databse/user.model";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import { connectToDatabase } from "../mongoose";
import Tag, { ITag } from "@/databse/tag.model";
import Question from "@/databse/question.model";
import { FilterQuery } from "mongoose";
import Interaction from "@/databse/interaction.model";

export async function getTopInterectedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const userInteractions = await Interaction.find({ user: user._id })
      .populate("tags")
      .exec();

    const userTags = userInteractions.reduce((tags, interaction) => {
      if (interaction.tags) {
        tags = tags.concat(interaction.tags);
      }
      return tags;
    }, []);

    // Count the occurrences of each tag
    const tagCountMap = userTags.reduce((countMap: any, tag: any) => {
      countMap.set(tag, (countMap.get(tag) || 0) + 1);
      return countMap;
    }, new Map());

    // Sort tags based on count in descending order
    const sortedTags = Array.from(tagCountMap.entries()).sort(
      (a: any, b: any) => b[1] - a[1]
    );

    // Get the top 3 tags
    const top3Tags = sortedTags.slice(0, 2).map((tag: any) => tag[0]);

    return top3Tags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }

    let sortOptions = {};
    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 };
        break;

      case "recent":
        sortOptions = { createdOn: -1 };
        break;

      case "name":
        sortOptions = { name: 1 };
        break;

      case "old":
        sortOptions = { createdOn: 1 };
        break;

      default:
        break;
    }

    const tags = await Tag.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalTags = await Tag.countDocuments(query);
    const isNext = totalTags > skipAmount + tags.length;

    return { tags, isNext };
  } catch (error) {
    console.log("MongoDB connection failed", error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase();
    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    const skipAmount = (page - 1) * pageSize;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
        skip: skipAmount,
        limit: pageSize + 1,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    const isNext = tag.questions.length > pageSize;
    if (!tag) {
      throw new Error("Tag not found");
    }

    const questions = tag.questions;

    return { tagTitle: tag.name, questions, isNext };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getTopPopularTags() {
  try {
    connectToDatabase();

    const popularTags = await Tag.aggregate([
      {
        // $project is used to reshape how to see tag and what
        // will get back. In this case name and then specify
        // each tag is going to have a number of questions proprety
        // that is going to be a size of the questions.
        // So that's going to be the number of questions
        // related to each tags
        $project: { name: 1, numberOfQuestions: { $size: "$questions" } },
      },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);

    return popularTags;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
