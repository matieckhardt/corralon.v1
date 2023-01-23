const { Schema, model } = require("mongoose");

const formSchema = new Schema(
  {
    Nombre: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("form", formSchema);