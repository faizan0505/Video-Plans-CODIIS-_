const { default: mongoose } = require("mongoose");
const {
  createOnePlan,
  createManyPlans,
  getCountOfPlans,
  getPlans,
  updateOnePlan,
  deleteOnePlan
} = require("../services/plans.services");
const ERROR_RESPONSE = require("../utils/handleErrorResponse");

module.exports.createAPlan = async (req, res) => {
  try {
    const {
      planName,
      price,
      durationValue,
      durationUnit,
      planDescription,
      isPlanActive
    } = req.body;

    if (!planName || !price || !durationValue || !durationUnit) {
      return res.status(400).json({
        status: false,
        message: "Plese fill the all required fields"
      });
    }

    const planPayload = {
      planName,
      price,
      durationValue,
      durationUnit,
      planDescription,
      planCreatedBy: req.user.id,
      isPlanActive,
      isPlanDeleted: false
    };

    const newPlan = await createOnePlan(planPayload, res);

    res.status(201).json({
      status: true,
      message: "New plan created successfully",
      data: newPlan
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.createBulkPlans = async (req, res) => {
  try {
    const { plans = [] } = req.body;

    if (plans.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Please provide at least one plan"
      });
    }

    const isFieldMissing = plans.some(
      (plan) =>
        !plan?.planName ||
        !plan?.price ||
        !plan?.durationValue ||
        !plan?.durationUnit
    );

    if (isFieldMissing) {
      return res.status(400).json({
        status: false,
        message:
          "All plans must contain planName, price, durationValue, and durationUnit"
      });
    }

    const plansPayload = plans.map((plan) => {
      return {
        ...plan,
        planCreatedBy: req.user.id,
        isPlanActive: true,
        isPlanDeleted: false
      };
    });

    await createManyPlans(plansPayload, res);

    res.status(201).json({
      status: true,
      message: "Bulk plans created successfully"
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.getAllPlansByAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = null, search = null } = req.query;

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    let searchCondition = {};
    if (search) {
      searchCondition = {
        $or: [
          { planName: { $regex: search, $options: "i" } },
          { planDescription: { $regex: search, $options: "i" } }
        ]
      };
    }

    let sortCondition = {};
    if (sort === "asc") {
      sortCondition = { price: 1 };
    } else if (sort === "desc") {
      sortCondition = { price: -1 };
    } else {
      sortCondition = { createdAt: -1 };
    }

    const pipeline = [
      {
        $match: {
          isPlanDeleted: false,
          ...searchCondition
        }
      },

      { $sort: sortCondition },
      {
        $skip: skip
      },
      {
        $limit: pageSize
      },
      {
        $lookup: {
          from: "users",
          localField: "planCreatedBy",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1
              }
            }
          ],
          as: "planCreatedBy"
        }
      },
      {
        $unwind: {
          path: "$planCreatedBy",
          preserveNullAndEmptyArrays: true
        }
      }
    ];

    const [plans, totalPlans] = await Promise.all([
      getPlans(pipeline, res),
      getCountOfPlans(
        {
          isPlanDeleted: false,
          ...searchCondition
        },
        res
      )
    ]);

    if (plans?.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No plans found",
        data: [],
        pagination: {
          totalPlans: 0,
          totalPages: 0,
          currentPage: pageNumber,
          pageSize
        }
      });
    }

    const totalPages = Math.ceil(totalPlans / pageSize);

    res.status(200).json({
      status: true,
      message: "Plans fetched successfully",
      data: plans,
      pagination: {
        totalPlans,
        totalPages,
        currentPage: pageNumber,
        pageSize
      }
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.getSinglePlanByAdmin = async (req, res) => {
  try {
    const { planId } = req.params;
    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(planId)
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "planCreatedBy",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1
              }
            }
          ],
          as: "planCreatedBy"
        }
      },
      {
        $unwind: {
          path: "$planCreatedBy",
          preserveNullAndEmptyArrays: true
        }
      }
    ];
    const isPlan = await getPlans(pipeline, res);

    if (!isPlan[0]) {
      return res.status(404).json({
        status: false,
        message: "Plan not found"
      });
    }

    res.status(200).json({
      status: true,
      message: "Plan fetched successfully",
      data: isPlan[0]
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.updateSinglePlanByAdmin = async (req, res) => {
  try {
    const { planId } = req.params;

    const {
      planName,
      price,
      durationValue,
      durationUnit,
      planDescription,
      isPlanActive,
      isPlanDeleted
    } = req.body;

    const updatedPlan = await updateOnePlan(
      planId,
      {
        planName,
        price,
        durationValue,
        durationUnit,
        planDescription,
        isPlanActive,
        isPlanDeleted
      },
      { new: true },
      res
    );

    if (!updatedPlan) {
      return res.status(404).json({
        status: false,
        message: "Plan not found"
      });
    }

    res.status(200).json({
      status: true,
      message: "Plan updated successfully",
      data: updatedPlan
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.permanentDeletePlan = async (req, res) => {
  try {
    const { planId } = req.params;

    const deletedPlan = await deleteOnePlan(planId, res);

    if (!deletedPlan) {
      return res.status(404).json({
        status: false,
        message: "Plan not found"
      });
    }

    res.status(200).json({
      status: true,
      message: "Plan deleted permanently successfully"
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};
