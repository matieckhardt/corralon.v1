const { Schema, model } = require('mongoose');

const comprasSchema = new Schema(
  {
    proveedor: String,
    razonSocial: String,
    tipoProveedor: String,
    condicionFiscal: String,
    cuit: String,
    comprobante: String,
    factura: String,
    fechaFc: String,
    productos: Array,
    observaciones: String,
    montoTotal: Number,
    ivaTotal: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = model('compras', comprasSchema);
