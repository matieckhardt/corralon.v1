const { Schema, model } = require("mongoose");

const indexprodsSchema = new Schema(
  {
    IndexProd: Number,
    InfoProd: String,
    DataProd: String,
  },
  {
    timestamps: true,
  }
);
module.exports = model("indexprods", indexprodsSchema);
