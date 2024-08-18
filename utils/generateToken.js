const jwt = require("jsonwebtoken");

module.exports.generateToken = (user) => {
  const TOKEN_SECRET = process.env.TOKEN_SECRET || "your_secret_key";
  let payload = {
    id: user._id,
    email: user?.email,
    phoneNumber: user?.phoneNumber,
    role: user?.role
  };

  const token = jwt.sign(payload, TOKEN_SECRET, {
    expiresIn: "24h"
  });

  return token;
};
