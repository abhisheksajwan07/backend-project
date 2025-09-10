import  Mongoose  from "mongoose";
import mongoose from "mongoose"
import argon2 from "argon2";

const userSchema =new Mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await argon2.hash(this.password);
    } catch (err) {
      return next(err);
    }
  }
});

userSchema.methods.comparePassword = async function (hashPassword) {
  try {
    return await argon2.verify(this.password, hashPassword);
  } catch (err) {
    throw err;
  }
};

userSchema.index({ username: "text" });

export const User = mongoose.model("User", userSchema);
