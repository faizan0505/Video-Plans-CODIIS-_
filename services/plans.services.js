const PLAN_MODEL = require("../models/plans.model");
const ERROR_RESPONSE = require("../utils/handleErrorResponse");

module.exports.createOnePlan = async (payload, res) => {
  try {
    const plan = await PLAN_MODEL.create(payload);
    return plan;
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.createManyPlans = async (payload, res) => {
  try {
    const plans = await PLAN_MODEL.insertMany(payload);
    return plans;
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.getPlans = async (pipeline, res) => {
  try {
    const plans = await PLAN_MODEL.aggregate(pipeline);
    return plans;
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.getCountOfPlans = async (conditions, res) => {
  try {
    const count = await PLAN_MODEL.countDocuments(conditions);
    return count;
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.updateOnePlan = async (id, payload, options, res) => {
  try {
    const updatedPlan = await PLAN_MODEL.findByIdAndUpdate(
      id,
      payload,
      options
    );
    return updatedPlan;
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.deleteOnePlan = async (id) => {
  try {
    const deletedPlan = await PLAN_MODEL.findByIdAndDelete(id);
    return deletedPlan;
  } catch (error) {
    throw new Error(error);
  }
};
