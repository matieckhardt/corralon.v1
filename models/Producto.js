const { Schema, model } = require('mongoose');

const productosSchema = new Schema(
  {
    proveedor: String,
    nombre: String,
    marca: String,
    precio: Number,
    iva: String,
    rubro: String,
    historial: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('productos', productosSchema);
