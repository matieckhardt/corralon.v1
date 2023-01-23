const { Schema, model } = require('mongoose');

const acopioSchema = new Schema(
  {
    cliente: String,
    clienteId: String,
    clienteCuit: String,
    clienteTel: String,
    ventaId: String,
    materialesAcopio: Array,
    materialesRetirados: Array,
  },
  {
    timestamps: true,
  }
);

module.exports = model('acopio', acopioSchema);
