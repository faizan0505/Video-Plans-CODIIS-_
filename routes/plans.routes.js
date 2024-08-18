const express = require("express");
const plansControllers = require("../controllers/plans.controllers");
const authorization = require("../middlewares/authorization");
const router = express.Router();

// createAPlan
router.post("/create-plan", authorization('admin'), plansControllers.createAPlan);

// createBulkPlans
router.post("/create-bulk-plans", authorization('admin'), plansControllers.createBulkPlans);

// getAllPlansByAdmin
router.get("/all", authorization('admin'), plansControllers.getAllPlansByAdmin);

// getSinglePlanByAdmin
router.get("/:planId", authorization('admin'), plansControllers.getSinglePlanByAdmin);

// updateSinglePlanByAdmin
router.patch("/update/:planId", authorization('admin'), plansControllers.updateSinglePlanByAdmin);

// permanentDeletePlan
router.delete("/delete/:planId", authorization('admin'), plansControllers.permanentDeletePlan);

module.exports = router;
