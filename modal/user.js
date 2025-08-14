import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    OTP: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    userToken: {
      type: String,
      default: null,
    },
    age: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const UserSchemasave =
  mongoose.models.UserSchemasave ||
  mongoose.model("UserSchemasave", userSchema);

export default UserSchemasave;
