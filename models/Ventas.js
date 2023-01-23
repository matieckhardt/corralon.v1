const { Schema, model } = require('mongoose');
const ventaSchema = new Schema(
  {
    acopioId: String,
    cliente: String,
    clienteId: String,
    clienteCuit: String,
	clienteTel: String,
    clienteCF: String,
    clienteDomicilio: String,
    comprobante: {
      type: String,
      default: 'S/C',
    },
    comprobanteId: Number,
    remitoId: String,
    comision: {
      type: Number,
      default: 0,
    },
    descuento: Number,
    faltaAcopio: Boolean,
    sinAcopio: {
      type: Boolean,
      default: false,
    },
    fecha: String,
    materialesVendidos: Array,
    precioTotal: Number,
    presupuesto: {
      type: Boolean,
      default: false,
    },
    emitido: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('venta', ventaSchema);
