const jwt = require("jsonwebtoken");
const { secretKey, expiresInJWT } = require("../config");

const getJsonWebToken = (userData) => {
  return jwt.sign(userData, secretKey, { expiresIn: expiresInJWT });
};

const getPayloadData = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return res.redirect("/api/login");
  }
};

module.exports = {
  getJsonWebToken,
  getPayloadData,
};
