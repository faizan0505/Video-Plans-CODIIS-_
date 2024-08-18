const express = require("express");
const planPurchaseControllers = require("../controllers/purchasePlan.controller");
const router = express.Router();

// getPlansByUser
router.get("/plans", planPurchaseControllers.getPlansByUser);

// getSinglePlanByUser
router.get("/plan/:planId", planPurchaseControllers.getSinglePlanByUser);

// buyPlanByCustomer
router.post("/buy", planPurchaseControllers.buyPlanByCustomer);

// fetchVideosListByCustomer
router.get("/list/:planId", planPurchaseControllers.fetchVideosListByCustomer);

// fetchVideosByCustomer
router.get("/video/:videoId", planPurchaseControllers.fetchVideosByCustomer);

module.exports = router;
