const mongoose = require("mongoose");

const gallertVideoSchema = new mongoose.Schema(
  {
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "videos",
      required: true
    },
    galleryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "favourite-galleries",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const GALLERY_VIDEOS_MODEL = mongoose.model(
  "gallery-videos",
  gallertVideoSchema
);

module.exports = GALLERY_VIDEOS_MODEL;
