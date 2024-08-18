const jwt = require("jsonwebtoken");
const { TokenExpiredError } = require("jsonwebtoken");
const ERROR_RESPONSE = require("../utils/handleErrorResponse");

module.exports.authentication = async (req, res, next) => {
  try {
    let token = req.headers?.authorization?.split(" ")[1];

    if (token) {
      try {
        const TOKEN_SECRET = process.env.TOKEN_SECRET || "your_secret_key";
        const decoded = jwt.verify(token, TOKEN_SECRET);
        req.body.user = decoded;
        req.user = decoded;
        next();
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          res.status(401).json({
            status: false,
            message: "Token has expired. Please log in again."
          });
        } else {
          res.status(401).json({
            status: false,
            message: "Invalid token. Please log in again."
          });
        }
      }
    } else {
      res.status(401).json({
        status: false,
        message: "Please log in first."
      });
    }
  } catch (error) {
    return ERROR_RESPONSE(res, error);
  }
};
