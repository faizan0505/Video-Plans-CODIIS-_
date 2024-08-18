const PLANS_VIDEOS_MODEL = require("../models/plans-videos.model");
const PLAN_MODEL = require("../models/plans.model");
const PURCHASE_PLAN_MODEL = require("../models/purchasePlan");
const VIDEOS_MODEL = require("../models/videos.model");
const { calculateEndDate } = require("../utils/dateCalculate");

module.exports.getAllPlansByUser = async (pipeline, res) => {
  try {
    const plans = await PURCHASE_PLAN_MODEL.aggregate(pipeline);
    return plans;
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.getPlanById = async (id, res) => {
  try {
    const plan = await PLAN_MODEL.findById(id);
    return plan;
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.createPurchasePlan = async (
  userId,
  planId,
  durationValue,
  durationUnit,
  res
) => {
  try {
    // Set the start date
    const startDate = new Date();
    const endDate = calculateEndDate(durationValue, durationUnit);

    const newPurchasePlan = new PURCHASE_PLAN_MODEL({
      userId,
      planId,
      startDate: startDate.toISOString(),
      endDate
    });

    await newPurchasePlan.save();
    return newPurchasePlan;
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.isPlanExistForUser = async (userId, planId, res) => {
  try {
    const userPlan = await PURCHASE_PLAN_MODEL.findOne({
      userId,
      planId
    });
    return {
      isPlanExist: !!userPlan,
      userPlan
    };
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.getPlanVideos = async (pipeline, res) => {
  try {
    const plan = await PLANS_VIDEOS_MODEL.aggregate(pipeline);
    return plan.videos;
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.getVideoById = async (videoId, res) => {
  try {
    const video = await VIDEOS_MODEL.findById(videoId);
    return video;
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};
