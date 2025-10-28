const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true }, // numeric incremental id (set in controller)
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      default: null,
      trim: true,
    },
    password: {
      type: String,
      default: null,
    },
    signupMethod: {
      type: String,
      enum: ["manual", "google"],
      required: true,
      default: "manual",
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
    googleId: {
      type: String,
      default: null,
    },
    picture: {
      type: String,
      default: null,
    },
    previousData: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Usercreate = mongoose.model("Usercreate", userSchema, "UserData");

module.exports = Usercreate;
