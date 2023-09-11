const { Schema, model } = require("mongoose");

const supplierSchema = new Schema({
  name: { type: String, required: true },
  legalName: { type: String },
  category: { type: String },
  docNro: { type: String, default: "23111111119" },
  taxCategory: { type: String },
  city: { type: String },
  address: { type: String },
  phoneNumber: { type: String },
  representative: { type: String },
});

module.exports = model("supplier", supplierSchema);
