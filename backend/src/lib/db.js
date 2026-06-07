import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4
    });

    console.log("MongoDB Connected");
    console.log(conn.connection.host);
  } catch (error) {
    console.error("Connection Error");
    console.error(error);
  }
};