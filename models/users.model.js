const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please enter a valid name."]
    },
    age: {
      type: Number,
      required: [true, "Please enter a valid age."],
      min: 0
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Please enter a valid email address."],
      unique: [true, "Email already exists."]
    },
    phoneNumber: {
      type: String,
      trim: true,
      required: [true, "Please enter a valid phone number."],
      unique: [true, "Phone number already exists."]
    },
    password: {
      type: String,
      trim: true,
      required: true
    },
    role: {
      type: String,
      trim: true,
      enum: ["user", "admin"],
      default: "user"
    },
    isAccountDeactivated: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const USERS_MODEL = mongoose.model("users", userSchema);

module.exports = USERS_MODEL;
