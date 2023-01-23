const path = require("path");

const fotoUpload = (req, res) => {
  return res.render("fotoUpload");
};

module.exports = {
  getHome: fotoUpload
};