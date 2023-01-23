const { Schema, model } = require('mongoose');

const pagosSchema = new Schema(
  {
    fecha: String,
    cliente: String,
    clienteId: String,
    comision: {
      type: Number,
      default: 0,
    },
    nroComprobante: Number,
    metodoDePago: String,
    observaciones: String,
    monto: Number,
    fechaCheque: {
      type: String,
      default: '',
    },
    numCheque: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('pagos', pagosSchema);
