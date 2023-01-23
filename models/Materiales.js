const { Schema, model } = require("mongoose");

const materialesSchema = new Schema(
  {
    nombre: String,
    precio: Number,
    rubro: String,
	stock: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = model("materiales", materialesSchema);
