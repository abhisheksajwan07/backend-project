import mongoose from "mongoose";
export const ConnectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("db connected ")
  } catch (err) {
    console.log(err.message);
    throw new Error("something went wrong",err)
  }
};
