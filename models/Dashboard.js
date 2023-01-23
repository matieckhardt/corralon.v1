const { Schema, model } = require("mongoose");

const dashboardSchema = new Schema(
  {
    cementos: Number,
    vendidoAño: Number,
    vendidoMes: Number,
    ranking: [
      {
        Nombre: String,
        Cantidad: Number,
      },
    ],
    clienteAño: {
      cliente: String,
      valor: Number,
    },
    clienteMes: {
      cliente: String,
      valor: Number,
    },
    proveedorAño: {
      proveedor: String,
      valor: Number,
    },
    proveedorMes: {
      proveedor: String,
      valor: Number,
    },

    compradoAño: Number,
    compradoMes: Number,
    metodoPago: {
      efectivo: Number,
      ctacte: Number,
      tarjeta: Number,
      cheque: Number,
      debito: Number
    },
    tipoCompro: {
      "S/C": Number,
      B: Number,
      A: Number,
      Ticket: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("dashboard", dashboardSchema);
