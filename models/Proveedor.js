const { Schema, model } = require('mongoose');

const proveedorSchema = new Schema(
  {
    nombre: String,
    razonSocial: String,
    tipo: String,
    cuit: Number,
    fiscal: String,
    address: String,
    localidad: String,
    tel: Number,
    contacto: String,
  },
  {
    timestamps: true,
    collection: 'proveedores',
  }
);

module.exports = model('proveedor', proveedorSchema);
