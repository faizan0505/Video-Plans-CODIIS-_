const mongoose = require("mongoose");

const plansVideosSchema = new mongoose.Schema(
  {
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "plans",
      required: true
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "videos",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const PLANS_VIDEOS_MODEL = mongoose.model("plans-videos", plansVideosSchema);

module.exports = PLANS_VIDEOS_MODEL;
