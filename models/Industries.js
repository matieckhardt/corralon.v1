const { Schema, model } = require("mongoose");

const industrySchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
});

module.exports = model("Industries", industrySchema);
