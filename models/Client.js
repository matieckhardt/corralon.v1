const { Schema, model } = require("mongoose");

const clientsSchema = new Schema({
  name: { type: String, required: true },
  legalName: { type: String, required: true },
  docTipo: { type: String, required: true },
  docNro: { type: String, default: "23111111119" },
  taxCategory: { type: String },
  city: { type: String, default: "" },
  address: { type: String, default: "" },
  phoneNumber: { type: String, default: "" },
  mailAddress: { type: String, default: "" },
  notes: { type: String, default: "" },
});

module.exports = model("clients", clientsSchema);
