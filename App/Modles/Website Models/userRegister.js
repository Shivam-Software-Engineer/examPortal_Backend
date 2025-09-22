const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
     id: { type: Number, unique: true },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // ✅ Ensure email uniqueness
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
      default: "manual", // ✅ Manual signup ke liye default
    },
  },
  { timestamps: true }
);


const Usercreate = mongoose.model("Usercreate", userSchema, "UserData");

module.exports = Usercreate;