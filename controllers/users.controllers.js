const bcrypt = require("bcrypt");
const ERROR_RESPONSE = require("../utils/handleErrorResponse");
const USERS_MODEL = require("../models/users.model");
const { generateToken } = require("../utils/generateToken");
const GROUP_USER_MODEL = require("../models/group-user.model");

module.exports.customerRegistration = async (req, res) => {
  try {
    const { email, password, phoneNumber } = req.body;

    if (!email || !password || !phoneNumber) {
      return res.status(400).json({
        status: false,
        message: "All fields are required."
      });
    }

    const existingUser = await USERS_MODEL.findOne({
      $or: [{ email: email }, { phoneNumber: phoneNumber }]
    });

    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "User with this email/phone number already exists."
      });
    }
    const hash = bcrypt.hashSync(password, 5);

    const userPayload = {
      ...req.body,
      email,
      password: hash,
      phoneNumber,
      role: "user"
    };

    const createUser = new USERS_MODEL(userPayload);
    await createUser.save();

    res.status(201).json({
      status: true,
      message: "User created successfully."
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.userLogin = async (req, res) => {
  try {
    let { email, phoneNumber, password } = req.body;

    if ((!email && !phoneNumber) || !password) {
      return res.status(401).json({
        status: false,
        message: "Please provide correct credentials"
      });
    }

    const isUser = await USERS_MODEL.findOne({
      $or: [{ email: email }, { phoneNumber: phoneNumber }]
    });

    console.log(isUser);

    if (!isUser) {
      return res.status(401).json({
        status: false,
        message: "No user found. Please create an account"
      });
    }

    if (isUser.isAccountDeactivated) {
      return res.status(401).json({
        status: false,
        message: `Your account has deactivated, Please contact to admin`
      });
    }

    let isPasswordValid = bcrypt.compareSync(password, isUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        message: "Invalid password"
      });
    }

    const token = generateToken(isUser);

    res.json({
      status: true,
      message: "Login successful",
      userName: isUser.name,
      token
    });
  } catch (error) {
    return ERROR_RESPONSE(res, error);
  }
};

module.exports.adminRegistration = async (req, res) => {
  try {
    const { email, password, phoneNumber } = req.body;

    if (!email || !password || !phoneNumber) {
      return res.status(400).json({
        status: false,
        message: "All fields are required."
      });
    }
    const existingUser = await USERS_MODEL.findOne({
      $or: [{ email: email }, { phoneNumber: phoneNumber }]
    });

    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "User with this email/phone number already exists."
      });
    }
    const hash = bcrypt.hashSync(password, 5);

    const userPayload = {
      ...req.body,
      email,
      password: hash,
      phoneNumber,
      role: "admin"
    };

    const createUser = new USERS_MODEL(userPayload);
    await createUser.save();

    res.status(201).json({
      status: true,
      message: "User created successfully."
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};

module.exports.createGroup = async (req, res) => {
  try {
    const { groupName, users } = req.body;

    const isGroup = await GROUP_USER_MODEL.findOneAndUpdate(
      { groupName },
      { users },
      { upsert: true, new: true }
    );

    res.status(201).json({
      status: true,
      message: "Group created successfully",
      data: isGroup
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
};
