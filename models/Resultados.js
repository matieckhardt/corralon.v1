const { Schema, model } = require("mongoose");

const mesesSchema = new Schema({
  ene: { type: Number, default: 0 },
  feb: { type: Number, default: 0 },
  mar: { type: Number, default: 0 },
  abr: { type: Number, default: 0 },
  may: { type: Number, default: 0 },
  jun: { type: Number, default: 0 },
  jul: { type: Number, default: 0 },
  ago: { type: Number, default: 0 },
  sep: { type: Number, default: 0 },
  oct: { type: Number, default: 0 },
  nov: { type: Number, default: 0 },
  dic: { type: Number, default: 0 },
  _id: false,
});

const resultadosSchema = new Schema(
  {
    ventas: mesesSchema,
    boni: mesesSchema,
    gasPro: mesesSchema,
    gasNoPro: mesesSchema,
    _id: false,
  },
  {
    timestamps: true,
  }
);

module.exports = model("resultados", resultadosSchema);
