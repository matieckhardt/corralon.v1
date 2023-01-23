const userModel = require("../models/User");

const { getHashedPassword } = require("../helpers/handlePassword");

const getUsers = (req, res, next) => {
  const userData = req.query;

  return res.json(userData);
};

const postUser = async (req, res, next) => {
  try {
    const userData = req.body;

    userData.password = await getHashedPassword(userData.password);

    const user = await userModel.create(userData);

    return res.json({ user: user });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ error: error });
  }
};

module.exports.getUsers = getUsers;
module.exports.postUser = postUser;
