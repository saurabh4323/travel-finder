import mongoose from "mongoose";

const connectdb = async () => {
  const url =
    "mongodb+srv://saurabhiitr01:y9ch5DAFNnxL3UmS@cluster0.di8qtqg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  try {
    await mongoose.createConnection(url);
    console.log("Database connected");
  } catch (error) {
    console.log("Database notconnected", error);
  }
};

export default connectdb;
