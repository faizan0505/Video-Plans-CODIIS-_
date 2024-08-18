const mongoose = require("mongoose");

const purchasePlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Please select a valid userId."]
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "plans",
      required: [true, "Please select a valid planId."]
    },
    startDate: {
      type: Date,
      default: new Date()
    },
    endDate: {
      type: Date,
      required: [true, "Please select a valid endDate."]
    }
  },
  {
    timeseries: true
  }
);
purchasePlanSchema.index({ userId: 1, planId: 1 }, { unique: true });
const PURCHASE_PLAN_MODEL = mongoose.model(
  "purchase-plans",
  purchasePlanSchema
);

module.exports = PURCHASE_PLAN_MODEL;
