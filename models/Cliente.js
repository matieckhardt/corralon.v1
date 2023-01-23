const { Schema, model } = require("mongoose");

const clienteSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    RazonSocial: String,
    dni: String,
    email: String,
    tel: String,
    fiscal: String,
    address: String,
    localidad: String,
    observaciones: String,
    debe: {
      type: Number,
      default: 0,
    },
    haber: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("cliente", clienteSchema);
