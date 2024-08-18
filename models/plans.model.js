const mongoose = require("mongoose");

const plansSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      trim: true,
      required: [true, "Please enter a valid plan name."]
    },
    price: {
      type: Number,
      required: [true, "Please enter a valid price."]
    },
    durationValue: {
      type: Number,
      required: [true, "Please enter a valid duration value."]
    },
    durationUnit: {
      type: String,
      trim: true,
      enum: ["seconds", "minutes", "hours", "days", "weeks", "months", "years"],
      required: [true, "Please select a valid duration unit."]
    },
    planDescription: {
      type: String,
      trim: true
    },
    planCreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    },
    isPlanActive: {
      type: Boolean,
      default: true
    },
    isPlanDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const PLAN_MODEL = mongoose.model("plans", plansSchema);

module.exports = PLAN_MODEL;
