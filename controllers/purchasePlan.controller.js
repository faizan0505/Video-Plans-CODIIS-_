const { default: mongoose } = require("mongoose");
const {
  getAllPlansByUser,
  getPlanById,
  createPurchasePlan,
  isPlanExistForUser,
  getPlanVideos,
  getVideoById
} = require("../services/purchasePlan.services");
const ERROR_RESPONSE = require("../utils/handleErrorResponse");

module.exports.getPlansByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const pipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          endDate: { $lte: new Date() }
        }
      },
      {
        $lookup: {
          from: "plans",
          let: { planId: "$planId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$planId"] },
                    { $eq: ["$isPlanActive", true] }
                  ]
                }
              }
            }
          ],
          as: "activePlans"
        }
      },
      {
        $project: {
          activePlans: { $arrayElemAt: ["$activePlans", 0] }
        }
      },
      {
        $match: {
          activePlans: { $ne: null }
        }
      }
    ];

    const plans = await getAllPlansByUser(pipeline);

    if (!plans.length) {
      return res.status(404).json({
        status: false,
        message: "No active plans found for this user."
      });
    }

    res.status(200).json({
      status: true,
      message: "Plans fetched successfully.",
      data: plans.map((plan) => plan.activePlans)
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.getSinglePlanByUser = async (req, res) => {
  try {
    const { planId } = req.params;
    const isPlan = await getPlanById(planId, res);

    if (!isPlan) {
      return res.status(404).json({
        status: false,
        message: "Plan not found"
      });
    }

    res.status(200).json({
      status: true,
      message: "Plan fetched successfully",
      data: isPlan
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.buyPlanByCustomer = async (req, res) => {
  try {
    const userId = req.user.id;

    const { planId } = req.body;
    const isPlan = await getPlanById(planId, res);

    if (!isPlan) {
      return res.status(404).json({
        status: false,
        message: "Plan not found"
      });
    }

    const userPlan = await createPurchasePlan(
      userId,
      planId,
      isPlan.durationValue,
      isPlan.durationUnit,
      res
    );

    if (!userPlan) {
      return res.status(400).json({
        status: false,
        message: "Failed to create user plan"
      });
    }

    res.status(200).json({
      status: true,
      message: "Plan purchased successfully",
      data: userPlan
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.fetchVideosListByCustomer = async (req, res) => {
  try {
    const { planId } = req.params;
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const { isPlanExist, userPlan } = await isPlanExistForUser({
      userId: req.user.id,
      planId,
      res
    });

    if (!isPlanExist) {
      return res.status(404).json({
        status: false,
        message: "You have not buy this plan"
      });
    }

    if (userPlan.endDate < new Date()) {
      return res.status(403).json({
        status: false,
        message: "Plan has been expired"
      });
    }

    const pipeline = [
      {
        $match: { planId }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      },
      {
        $lookup: {
          from: "videos",
          localField: "videoId",
          foreignField: "_id",
          as: "videos"
        }
      },
      {
        $unwind: {
          path: "$videos",
          preserveNullAndEmptyArrays: true
        }
      }
    ];

    const videos = await getPlanVideos(pipeline);

    res.status(200).json({
      status: true,
      message: "Videos list fetched successfully",
      data: videos
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.fetchVideosByCustomer = async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await getVideoById(videoId, res);

    if (!video) {
      return res.status(404).json({
        status: false,
        message: "Video not found"
      });
    }

    res.status(200).json({
      status: true,
      message: "Video fetched successfully",
      data: video
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};
