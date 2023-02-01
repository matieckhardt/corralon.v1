const authCtrl = {};
const User = require("../models/User");
const { comparePassword } = require("../helpers/handlePassword");
const { getJsonWebToken } = require("../helpers/handleJWT");
const { setCookie } = require("../helpers/handleCookie");

const year = new Date().getFullYear();
const month = new Date().getMonth() + 1;

authCtrl.handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401);
      return res.json({ error: "User not registered" });
    }

    const isAuthorized = comparePassword(password, user.password);

    if (!isAuthorized) {
      res.status(401);
      return res.json({ error: "User not authorized" });
    }

    const payload = {
      email: user.email,
      name: user.name,
    };
    const token = getJsonWebToken(payload);

    setCookie(req, token);
    console.log("/api/dashboard/" + year + "/" + month);
    return res.redirect("/api/dashboard/" + year + "/" + month);
  } catch (error) {
    console.log(error);
    res.status(500);
    return res.redirect("/api/login");
  }
};

module.exports = authCtrl;
