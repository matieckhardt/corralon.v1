const userCtrl = {};
const User = require("../models/User");

userCtrl.index = (req, res) => {
  res.render("users", { active: { users: true } });
};

userCtrl.listUsers = async (req, res) => {
  const userList = await User.find();
  res.json(userList);
};

userCtrl.createUser = async (req, res) => {
  try {
    const user = ({ nombre, email, password, role } = req.body);
    const newUser = new User(user);
    await newUser.save();
    return false;
  } catch (error) {
    res.status(500).send("There was a problem registering the user");
  }
};

userCtrl.editUser = async (req, res) => {
  try {
    const userEdited = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!userEdited) {
      return res.status(204).json({ message: "user not found" });
    } else {
      return res.json(userEdited);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("There was a problem editing the user");
  }
};

userCtrl.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userDeleted = await User.findByIdAndDelete(id);
    if (!userDeleted) {
      return res.status(204).json({ message: "user not found" });
    } else {
      return res.json(userDeleted);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("There was a problem deleting the user");
  }
};

module.exports = userCtrl;
