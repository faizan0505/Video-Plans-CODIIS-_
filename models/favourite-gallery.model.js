const mongoose = require("mongoose");

const favouriteGallerySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    galleryName: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const FAVOURITE_GALLERY_MODEL = mongoose.model(
  "favourite-galleries",
  favouriteGallerySchema
);

module.exports = FAVOURITE_GALLERY_MODEL;
