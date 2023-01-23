const { Schema, model } = require("mongoose");

const productosSchema = new Schema(
  {
    MainImageURL: String,
    Title: String,
    Description: String,
    Resumen: String,
    SpecA: String,
    SpecB: String,
    SpecC: String,
    SpecD: String,
    SpecE: String,
    LinkUrl: String,
    SubCategoriaName: String,
    imgCar: Array,
  },
  {
    timestamps: true,
  }
);

module.exports = model("productos", productosSchema);
