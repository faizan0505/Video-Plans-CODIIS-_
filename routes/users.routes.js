const express = require("express");
const userControllers = require("../controllers/users.controllers");
const { authentication } = require("../middlewares/authentication");
const router = express.Router();

// customerRegistration
router.post("/register", userControllers.customerRegistration);

// userLogin
router.post("/login", userControllers.userLogin);

// adminRegistration
router.post("/admin/register", userControllers.adminRegistration);

router.use(authentication);

router.post("/create-group", userControllers.createGroup);

module.exports = router;
