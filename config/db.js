const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URL =
  process.env.mongoURL ||
  "mongodb+srv://faizan:faizan@cluster0.dvtb7.mongodb.net/codiis?retryWrites=true&w=majority";

const connection = async () => {
  try {
    await mongoose.connect(MONGO_URL);

    console.log("DB connected successfully");
  } catch (error) {
    console.error("DB connection Error", error);
    throw error;
  }
};

module.exports = { connection };
