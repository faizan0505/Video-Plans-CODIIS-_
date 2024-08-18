const mongoose = require("mongoose");

const videosSchema = new mongoose.Schema(
  {
    videoName: {
      type: String,
      trim: true
    },
    mimeType: {
      type: String,
      trim: true
    },
    size: {
      type: Number
    },
    duration: {
      type: Number
    },
    resolution: {
      width: { type: Number },
      height: { type: Number }
    },
    codec: {
      type: String,
      trim: true
    },
    bitRate: {
      type: Number
    },
    frameRate: {
      type: Number
    },
    filePath: {
      type: String,
      trim: true
    },
    thumbnailPath: {
      type: String,
      trim: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    }
  },
  {
    timestamps: true
  }
);

const VIDEOS_MODEL = mongoose.model("videos", videosSchema);

module.exports = VIDEOS_MODEL;
