import mongoose from "mongoose";

let isconnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) {
    return console.error(" Missing MONGODBURL");
  }

  if (isconnected) {
    return console.log("MongoDb is already connected");
  }

  try {
    mongoose.connect(process.env.MONGODB_URL, { dbName: "codeOverflow" });
    isconnected = true;
    console.log("MongoDb is connected");
  } catch (error) {
    console.error("MongoDb connection failed", error);
  }
};
