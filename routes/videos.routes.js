const express = require("express");
const videoControllers = require("../controllers/videos.controllers");
const { upload } = require("../config/upload");
const authorization = require("../middlewares/authorization");
const router = express.Router();

// videoUpload
router.post("/upload", authorization('admin'), upload.single("video"), videoControllers.uploadVideo);

// mapVideoToPlan
router.post("/map", authorization('admin'), videoControllers.mapVideoToPlan);

// getAllVideos
router.get("/", authorization('admin'), videoControllers.getAllVideos);

module.exports = router;
