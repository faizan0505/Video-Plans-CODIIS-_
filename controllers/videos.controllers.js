const PLANS_VIDEOS_MODEL = require("../models/plans-videos.model");
const VIDEOS_MODEL = require("../models/videos.model");
const ERROR_RESPONSE = require("../utils/handleErrorResponse");

module.exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "No video file uploaded."
      });
    }

    const videoFilePath = `/uploads/videos/${req.file.filename}`;

    const payload = {
      videoName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      duration: req.body.duration,
      resolution: {
        width: req.body.width,
        height: req.body.height
      },
      codec: req.body.codec,
      bitRate: req.body.bitRate,
      frameRate: req.body.frameRate,
      filePath: videoFilePath,
      thumbnailPath: req.body.thumbnailPath || "",
      uploadedBy: req.body.uploadedBy
    };

    const video = await VIDEOS_MODEL.create(payload);

    res.status(200).json({
      status: true,
      message: "Video uploaded successfully.",
      data: video
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.mapVideoToPlan = async (req, res) => {
  try {
    const { planId, videoId } = req.body;

    const updatedPlanVideoMapping = await PLANS_VIDEOS_MODEL.findOneAndUpdate(
      { planId, videoId },
      { planId, videoId },
      { upsert: true, new: true }
    );

    res.status(200).json({
      status: true,
      message: "Video mapped to plan successfully.",
      data: updatedPlanVideoMapping
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.getAllVideos = async (req, res) => {
  try {
    const allVideos = await VIDEOS_MODEL.find();

    res.status(200).json({
      status: true,
      message: "All videos fetched successfully.",
      data: allVideos
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};
